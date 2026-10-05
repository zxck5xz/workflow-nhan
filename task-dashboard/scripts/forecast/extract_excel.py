"""Trích tham số và số chuẩn (golden) từ AuGo_Master_Plan_Final.xlsx.

Sinh ra:
  src/modules/forecast/engine/presets/excel-original.json  - bộ tham số đầu vào cho engine
  tests/forecast/fixtures/excel-forecast.json             - số Excel đã tính sẵn để đối chiếu

Chạy từ task-dashboard: python scripts/forecast/extract_excel.py <đường dẫn AuGo_Master_Plan_Final.xlsx>

Chạy: python scripts/extract_excel.py
"""

import json
import os
import re
import sys

import openpyxl
from openpyxl.utils import column_index_from_string as ci

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if len(sys.argv) < 2:
    sys.exit(
        "Cách dùng: python scripts/forecast/extract_excel.py <đường dẫn AuGo_Master_Plan_Final.xlsx>"
    )
XLSX = sys.argv[1]
PRESETS = os.path.join(ROOT, "src", "modules", "forecast", "engine", "presets")
PRESET_OUT = os.path.join(PRESETS, "excel-original.json")
GOLDEN_OUT = os.path.join(ROOT, "tests", "forecast", "fixtures", "excel-forecast.json")
REFERENCE_OUT = os.path.join(PRESETS, "excel-reference.json")

MONTHS = 24
DAYS = MONTHS * 30
FIRST_DAY_ROW = 59  # Forecast row of OB day 1
PRE_ROWS = range(54, 59)  # OB-5 .. OB-1
MONTH_COLS = [chr(c) for c in range(ord("G"), ord("Z") + 1)] + ["AA", "AB", "AC", "AD"]  # T1..T24
PRE_COLS = ["C", "D", "E", "F"]  # T-4..T-1


def load():
    f = openpyxl.load_workbook(XLSX, read_only=True, data_only=False)
    v = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)

    def grid(wb, name, max_row, max_col):
        rows = {}
        for r, row in enumerate(
            wb[name].iter_rows(min_row=1, max_row=max_row, max_col=max_col, values_only=True), 1
        ):
            rows[r] = list(row)
        return rows

    return (
        grid(f, "Forecast", 778, 30),
        grid(v, "Forecast", 778, 30),
        grid(v, "Doanh thu-LTV", 366, 7),
    )


def cell(rows, ref):
    m = re.fullmatch(r"([A-Z]+)(\d+)", ref)
    return rows[int(m.group(2))][ci(m.group(1)) - 1]


def num(x):
    return 0 if x is None else x


def month_series(vals, row, n=MONTHS, start_col="B"):
    s = ci(start_col) - 1
    return [num(vals[row][s + i]) for i in range(n)]


def pct_in(formula, pattern):
    m = re.search(pattern, formula)
    return float(m.group(1)) / 100 if m else 1.0


def main():
    formulas, values, ltv = load()
    rate = cell(values, "E39")

    # --- Acquisition (Excel "install plan" mode)
    installs = month_series(values, 46)
    organic = month_series(values, 47)
    cpn = month_series(values, 50)
    launch_install_boost = [values[FIRST_DAY_ROW + d][2] / installs[0] for d in range(30)]
    launch_mkt_boost = [
        values[FIRST_DAY_ROW + d][7] / (values[FIRST_DAY_ROW + d][5] * cpn[0]) for d in range(30)
    ]

    # Trim trailing 1.0 values
    def trim(a):
        a = [round(x, 6) for x in a]
        while a and a[-1] == 1.0:
            a.pop()
        return a

    pre_reg = []
    for r in PRE_ROWS:
        pre_reg.append(
            {
                "label": values[r][1],
                "installs": values[r][2],
                "conversion": pct_in(formulas[r][5], r"\*(\d+)%"),
                "mktFactor": values[r][7] / (values[r][5] * cpn[0]),
            }
        )

    # --- Retention: anchors + interpolation weights between anchors (Forecast col A)
    a = {r: values[r][0] for r in range(59, 419)}
    r1, r3, r7, r14, r30 = (cell(values, c) for c in ("C43", "D43", "E43", "F43", "G43"))

    def weights(lo_row, hi_row, lo, hi):
        return [round((lo - a[r]) / (lo - hi), 6) for r in range(lo_row + 1, hi_row)]

    retention = {
        "d1": r1,
        "d3": r3,
        "d7": r7,
        "d14": r14,
        "d30": r30,
        "d2FromD1": a[61] / r1,
        "w3to7": weights(62, 66, r3, r7),
        "w7to14": weights(66, 73, r7, r14),
        "w14to30": weights(73, 89, r14, r30),
        "tailKeep": round(a[90] / a[89], 6),
        "floor": 0,
        "cutoffAge": next(r for r in range(90, 419) if a[r] == 0) - FIRST_DAY_ROW,
        "launchCohortBoost": 1.2,
        "launchCohortBoostCycleDays": 120,
    }

    # --- ARPU curve by age (sheet Doanh thu-ltv, col C = phase 1, E = phase 2, G = phase 3)
    arpu = [num(ltv[r][2]) for r in range(2, 367)]
    e = [num(ltv[r][4]) for r in range(2, 367)]
    g = [num(ltv[r][6]) for r in range(2, 367)]
    ratio2 = e[0] / arpu[0]
    ratio3 = g[0] / e[0]
    mism2 = [i for i in range(365) if abs(e[i] - arpu[i] * ratio2) > 1e-6]
    mism3 = [i for i in range(365) if abs(g[i] - e[i] * ratio3) > 1e-6]

    # --- Costs per month: pre-OB months (T-4..T-1) are lumped into T1
    def cost_row(row):
        pre = sum(num(cell(values, f"{c}{row}")) for c in PRE_COLS)
        ms = [num(cell(values, f"{c}{row}")) for c in MONTH_COLS]
        ms[0] += pre
        return ms

    preset = {
        "name": "Excel gốc (AuGo Master Plan)",
        "months": MONTHS,
        "usdVnd": rate,
        "acquisition": {
            "mode": "installPlan",
            "cvr": cell(values, "A43"),
            "installsPerDay": installs,
            "organicRatio": organic,
            "cpn": cpn,
            "launchInstallBoost": trim(launch_install_boost),
            "launchMktBoost": trim(launch_mkt_boost),
            "preRegistration": pre_reg,
            "targetNruPerDay": [
                round(i * cell(values, "A43") * (1 + o))
                for i, o in zip(installs, organic, strict=True)
            ],
            "budgetMonth1": 5_530_000_000,
            "budgetMaintain": 604_800_000,
            "budgetDecay": 0.5,
        },
        "retention": retention,
        "revenue": {
            "model": "arpuCurve",
            "arpuCurve": arpu,
            "phaseMultipliers": [1, round(ratio2, 6), round(ratio2 * ratio3, 6)],
            "phaseStartDays": [1, 2, 8],
            "payrate": cell(values, "B43"),
            "payerLifetimeValue": 210_811,
        },
        "costs": {
            "iapRatio": [0.2, 0.15] + [0.1] * (MONTHS - 2),
            "nonIapRatio": 0.8,
            "vatRate": 0.1,
            "iapVatBase": 0.85,
            "paymentFee": cell(values, "E37"),
            "adsTax": 0.07,
            "ongDivisor": 1.17,
            "devIapDeduct": 0.7,
            "devGrossUp": 1.0588,
            "shareRate": cell(values, "B40"),
            "licenseFeeUsd": cell(values, "B37"),
            "minimumGuaranteeUsd": cell(values, "B39"),
            "includeShareDevInCost": True,
            "fixed": {
                "branding": cost_row(18),
                "community": cost_row(19),
                "bonus": cost_row(25),
                "server": cost_row(26),
                "staff": cost_row(27),
                "other": cost_row(28),
                "managementFee": cost_row(29),
            },
        },
    }

    # --- Golden numbers (Excel cached values)
    def month_vals(row):
        return [num(cell(values, f"{c}{row}")) for c in MONTH_COLS]

    def pre_sum(row):
        return sum(num(cell(values, f"{c}{row}")) for c in PRE_COLS)

    daily = {
        "installUa": [values[FIRST_DAY_ROW + d][2] for d in range(DAYS)],
        "nruUa": [values[FIRST_DAY_ROW + d][3] for d in range(DAYS)],
        "nru": [values[FIRST_DAY_ROW + d][5] for d in range(DAYS)],
        "dau": [values[FIRST_DAY_ROW + d][6] for d in range(DAYS)],
        "mkt": [values[FIRST_DAY_ROW + d][7] for d in range(DAYS)],
        "revenue": [num(values[FIRST_DAY_ROW + d][10]) for d in range(DAYS)],
        "pu": [values[FIRST_DAY_ROW + d][12] for d in range(DAYS)],
    }
    golden = {
        "retention": [a[r] for r in range(59, 419)],
        "arpuPhaseMismatch": {"phase2": mism2, "phase3": mism3},
        "daily": daily,
        "monthly": {
            "nru": month_vals(3),
            "nruUa": month_vals(4),
            "revenueOnG": month_vals(8),
            "revenueDev": month_vals(9),
            "revenueIap": month_vals(10),
            "revenueNonIap": month_vals(11),
            "revenue": month_vals(12),
            "vat": month_vals(15),
            "paymentFee": month_vals(16),
            "mkt": month_vals(17),
            "adsTax": month_vals(20),
            "shareDev": month_vals(21),
            "shareDevAfterMg": month_vals(24),
            "totalSpent": month_vals(31),
            "profit": month_vals(34),
            "cumulative": month_vals(35),
        },
        "preObTotalSpent": pre_sum(31),
        "totals": {
            "nru": cell(values, "B3"),
            "revenue": cell(values, "B12"),
            "totalSpent": cell(values, "B31"),
            "profit": cell(values, "B34"),
            "profitOverSpent": cell(values, "B35"),
        },
    }

    cumulative = golden["monthly"]["cumulative"]
    reference = {
        "nru": cell(values, "B3"),
        "mkt": cell(values, "B17"),
        "revenue": cell(values, "B12"),
        "totalSpent": cell(values, "B31"),
        "profit": cell(values, "B34"),
        "breakEvenMonth": next((i + 1 for i, v in enumerate(cumulative) if v >= 0), None),
    }

    for path, data in ((PRESET_OUT, preset), (GOLDEN_OUT, golden), (REFERENCE_OUT, reference)):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, indent=1)
        print("wrote", os.path.relpath(path, ROOT))
    print("ARPU phase ratios", ratio2, ratio3, "mismatches", len(mism2), len(mism3))
    print(
        "retention cutoffAge",
        retention["cutoffAge"],
        "weights",
        retention["w3to7"],
        retention["w7to14"],
        retention["w14to30"],
    )


if __name__ == "__main__":
    main()
