import { useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Modal } from '../common';
import {
  FIELD_LABELS,
  REQUIRED_FIELDS,
  TIMELINE_FIELDS,
  autoMapHeaders,
  buildProjectFromTimeline,
  detectHeaderRow,
  detectSheet,
  normalizeRows,
  readWorkbook,
  type ColumnMapping,
  type SheetData,
  type TimelineField,
} from '../../utils/timelineImport';
import { formatDate } from '../../utils';
import type { Project, Task } from '../../types';
import './TimelineImportModal.css';

const COLORS = ['#3b82f6', '#00c48c', '#8b5cf6', '#e74c8b', '#06b6d4', '#ffb830', '#84cc16'];
const PREVIEW_ROWS = 20;

interface TimelineImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (payload: { project: Project; tasks: Task[] }) => void;
}

// Remount on open so each import starts from an empty form.
export function TimelineImportModal(props: TimelineImportModalProps) {
  return <ImportForm key={props.isOpen ? 'open' : 'closed'} {...props} />;
}

function ImportForm({ isOpen, onClose, onImport }: TimelineImportModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [sheetIdx, setSheetIdx] = useState(0);
  const [headerRow, setHeaderRow] = useState(-1);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  const selectSheet = (all: SheetData[], idx: number) => {
    const rows = all[idx]?.rows ?? [];
    const hr = detectHeaderRow(rows);
    setSheetIdx(idx);
    setHeaderRow(hr);
    setMapping(hr >= 0 ? autoMapHeaders(rows[hr]) : {});
  };

  const handleFile = async (f: File | undefined) => {
    if (!f) return;
    if (!/\.(xlsx|xlsm|xls|csv)$/i.test(f.name)) {
      setError('Chỉ hỗ trợ file Excel (.xlsx, .xls) hoặc .csv');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const all = await readWorkbook(f);
      setFile(f);
      setSheets(all);
      setProjectName(f.name.replace(/\.[^.]+$/, ''));
      selectSheet(all, detectSheet(all));
    } catch (e) {
      setError(`Không đọc được file: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => sheets[sheetIdx]?.rows ?? [], [sheets, sheetIdx]);
  const headers = headerRow >= 0 ? (rows[headerRow] ?? []) : [];
  const missingRequired = REQUIRED_FIELDS.filter((f) => mapping[f] === undefined);
  const missingEnd =
    mapping.end === undefined && mapping.completion === undefined && mapping.duration === undefined;

  const result = useMemo(
    () => (headerRow >= 0 ? normalizeRows(rows, headerRow, mapping) : null),
    [rows, headerRow, mapping],
  );

  const canImport =
    !!result && result.valid.length > 0 && missingRequired.length === 0 && !missingEnd;

  const handleImport = () => {
    if (!result || !file || !canImport) return;
    const payload = buildProjectFromTimeline(result.tasks, {
      projectName,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      sourceFile: file.name,
      sheetName: sheets[sheetIdx].name,
      makeId: () => uuid().slice(0, 8),
    });
    onImport(payload);
  };

  const setField = (field: TimelineField, value: string) => {
    setMapping((m) => {
      const next = { ...m };
      if (value === '') delete next[field];
      else next[field] = Number(value);
      return next;
    });
  };

  const previewTasks = (result?.tasks ?? [])
    .filter((t) => !showOnlyIssues || t.errors.length || t.warnings.length)
    .slice(0, PREVIEW_ROWS);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📥 Import timeline từ Excel"
      className="modal--wide"
      footer={
        <>
          {file && (
            <Button variant="ghost" onClick={() => inputRef.current?.click()}>
              Chọn file khác
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="primary" onClick={handleImport} disabled={!canImport}>
            Import dự án{result ? ` (${result.valid.length} task)` : ''}
          </Button>
        </>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xlsm,.xls,.csv"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {!file && (
        <div
          className={`tl-dropzone ${dragOver ? 'tl-dropzone--over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
        >
          <div className="tl-dropzone__icon">📄</div>
          <div className="tl-dropzone__title">
            {loading ? 'Đang đọc file…' : 'Kéo thả file timeline vào đây hoặc bấm để chọn'}
          </div>
          <div className="tl-dropzone__hint">
            File .xlsx có các cột: <b>TT</b>, <b>Nội dung công việc</b>, <b>Đảm nhiệm</b>,{' '}
            <b>Bắt đầu</b>, <b>Kéo dài</b>, <b>Hoàn thành</b>, <b>Kết thúc / Deadline</b>,{' '}
            <b>Tiến độ</b>. Hệ thống tự nhận diện theo tên cột.
          </div>
        </div>
      )}

      {error && <div className="tl-error">{error}</div>}

      {file && (
        <div className="tl-body">
          <div className="tl-fileinfo">
            <span>📄 {file.name}</span>
            <span>{(file.size / 1024).toFixed(1)} KB</span>
            <span>{sheets.length} sheet</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên dự án</label>
              <input
                className="form-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sheet chứa task</label>
              <select
                className="form-select"
                value={sheetIdx}
                onChange={(e) => selectSheet(sheets, Number(e.target.value))}
              >
                {sheets.map((s, i) => (
                  <option key={s.name} value={i}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {headerRow < 0 ? (
            <div className="tl-error">
              Không tìm thấy dòng tiêu đề có cột tên công việc trong sheet này. Hãy chọn sheet khác.
            </div>
          ) : (
            <>
              <div className="tl-section-title">
                Mapping cột <span className="tl-muted">(header ở dòng {headerRow + 1})</span>
              </div>
              <div className="tl-mapping">
                {TIMELINE_FIELDS.map((field) => (
                  <label key={field} className="tl-mapping__item">
                    <span>
                      {FIELD_LABELS[field]}
                      {REQUIRED_FIELDS.includes(field) && <b className="tl-required"> *</b>}
                    </span>
                    <select
                      className="form-select"
                      value={mapping[field] ?? ''}
                      onChange={(e) => setField(field, e.target.value)}
                    >
                      <option value="">— Không có —</option>
                      {headers.map((h, i) => (
                        <option key={i} value={i}>
                          {String(h ?? '').trim() || `(Cột ${i + 1})`}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {(missingRequired.length > 0 || missingEnd) && (
                <div className="tl-error">
                  Cần map cột:{' '}
                  {[
                    ...missingRequired.map((f) => FIELD_LABELS[f]),
                    ...(missingEnd ? ['Ngày kết thúc / Hoàn thành (hoặc Thời lượng)'] : []),
                  ].join(', ')}
                </div>
              )}

              {result && (
                <>
                  <div className="tl-summary">
                    <div className="tl-summary__item tl-summary__item--ok">
                      <b>{result.valid.length}</b> task hợp lệ
                    </div>
                    <div className="tl-summary__item tl-summary__item--warn">
                      <b>{result.warningCount}</b> thiếu dữ liệu (vẫn import)
                    </div>
                    <div className="tl-summary__item tl-summary__item--err">
                      <b>{result.invalid.length}</b> lỗi (bỏ qua)
                    </div>
                    {result.phases.length > 0 && (
                      <div className="tl-summary__item">
                        <b>{result.phases.length}</b> nhóm/giai đoạn
                      </div>
                    )}
                    <label className="tl-summary__toggle">
                      <input
                        type="checkbox"
                        checked={showOnlyIssues}
                        onChange={(e) => setShowOnlyIssues(e.target.checked)}
                      />
                      Chỉ hiện dòng có vấn đề
                    </label>
                  </div>

                  <div className="tl-preview">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Dòng</th>
                          <th>ID</th>
                          <th>Đầu việc</th>
                          <th>Team</th>
                          <th>Bắt đầu</th>
                          <th>Thời lượng</th>
                          <th>Hoàn thành</th>
                          <th>Kết thúc</th>
                          <th>Tiến độ</th>
                          <th>Kiểm tra</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewTasks.map((t) => (
                          <tr key={t.rowNumber} className={t.errors.length ? 'tl-row--error' : ''}>
                            <td className="tl-muted">{t.rowNumber}</td>
                            <td>{t.code}</td>
                            <td className="tl-name">{t.name}</td>
                            <td>{t.team}</td>
                            <td>{t.startDate ? formatDate(t.startDate) : '—'}</td>
                            <td>{t.duration ? `${t.duration} ngày` : '—'}</td>
                            <td>{t.completionDate ? formatDate(t.completionDate) : '—'}</td>
                            <td>{t.endDate ? formatDate(t.endDate) : '—'}</td>
                            <td>{t.progress}%</td>
                            <td className="tl-check">
                              {t.errors.length > 0 ? (
                                <span className="tl-check--err" title={t.errors.join('\n')}>
                                  ❌ {t.errors[0]}
                                </span>
                              ) : t.warnings.length > 0 ? (
                                <span className="tl-check--warn" title={t.warnings.join('\n')}>
                                  ⚠️ {t.warnings[0]}
                                </span>
                              ) : (
                                <span className="tl-check--ok">✓</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.tasks.length > previewTasks.length && (
                      <div className="tl-muted tl-more">
                        Hiển thị {previewTasks.length}/{result.tasks.length} dòng
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
