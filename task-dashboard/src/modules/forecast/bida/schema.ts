import type { BidaInputs } from './engine';

export type FieldType = 'num' | 'pct' | 'money' | 'usd' | 'select' | 'text';

export interface FieldDef {
  id: keyof BidaInputs;
  label: string;
  type: FieldType;
  hint?: string;
  opts?: [string | number, string][];
  /** Chỉ hiện ở chế độ này */
  when?: BidaInputs['mode'];
  /** Chỉ có tác dụng khi giữ chân "Theo mốc" */
  moc?: boolean;
}

export interface GroupDef {
  g: string;
  /** Cả nhóm nằm trong mục "Nâng cao" */
  adv?: boolean;
  items: FieldDef[];
}

/** Sơ đồ ô nhập theo forecast-bida-8-pool (5).html (+ tên game, marketing / chi phí khác mỗi tháng). */
export const SCHEMA: GroupDef[] = [
  {
    g: 'Người dùng',
    items: [
      { id: 'name', label: 'Tên game', type: 'text' },
      {
        id: 'months',
        label: 'Số tháng dự phóng',
        type: 'select',
        opts: [
          [12, '12 tháng'],
          [18, '18 tháng'],
          [24, '24 tháng'],
          [36, '36 tháng'],
        ],
      },
      {
        id: 'installM1',
        label: 'Install/ngày · 3 tháng đầu',
        type: 'num',
        when: 'users',
        hint: 'Mức nền. Ngày đầu tháng đông gấp đôi, cuối tháng về nền',
      },
      { id: 'installM4', label: 'Install/ngày · tháng 4–6', type: 'num', when: 'users' },
      { id: 'installLater', label: 'Install/ngày · từ tháng 7', type: 'num', when: 'users' },
      {
        id: 'prelaunchDays',
        label: 'Số ngày chạy trước khi mở game',
        type: 'num',
        hint: 'Bản gốc 5 ngày: user đăng ký trước, vào chính thức từ ngày OB',
      },
      {
        id: 'budgetM1',
        label: 'Ngân sách ads tháng 1',
        type: 'money',
        when: 'budget',
        hint: 'Tháng mở game',
      },
      { id: 'budgetMaintain', label: 'Ngân sách ads duy trì', type: 'money', when: 'budget' },
      { id: 'budgetDecay', label: 'Số tháng về mức duy trì', type: 'num', when: 'budget' },
      { id: 'cvr', label: 'Cài đặt → user thật (CVR)', type: 'pct', hint: 'Mặc định 80%' },
      {
        id: 'organic',
        label: 'User tự nhiên cộng thêm',
        type: 'pct',
        hint: '% so với user mua ads · mặc định 20%',
      },
      {
        id: 'organicLater',
        label: 'User tự nhiên sau 12 tháng',
        type: 'pct',
        hint: 'Tăng dần theo quý từ mức trên tới mức này · bản gốc 40%',
      },
    ],
  },
  {
    g: 'Giá và doanh thu 1 user',
    items: [
      {
        id: 'cpn',
        label: 'Giá 1 user mới (CPN) tháng 1',
        type: 'money',
        hint: '≈ 1 USD · ngày công bố',
      },
      {
        id: 'cpnGiam',
        label: 'CPN tháng 3 còn lại',
        type: 'pct',
        hint: 'Gõ 50 = tháng 3 trở đi CPN còn 50% của tháng 1, giữ mức đó tới hết tháng 12 (tháng 2 lấy mức giữa)',
      },
      {
        id: 'cpnSan',
        label: 'Sàn CPN từ tháng 13',
        type: 'pct',
        hint: 'Gõ 30 = từ tháng 13 không xuống dưới 30% của tháng 1',
      },
      {
        id: 'ltvD0',
        label: 'Doanh thu ngày đầu · 1 user',
        type: 'money',
        hint: 'Tiền nạp + ads của 1 user trong ngày đầu',
      },
      {
        id: 'heSoVeSau',
        label: 'Hệ số cho user vào từ ngày 8',
        type: 'pct',
        hint: 'Bản gốc 70,83% = user vào từ ngày 8 chi tiêu bằng 70,83% mức chuẩn',
      },
      {
        id: 'heSoGiaiDoan2',
        label: 'Hệ số cho user vào ngày 2–7',
        type: 'pct',
        hint: 'Bản gốc 83,33% = user vào ngày 2–7 chi tiêu bằng 83,33% mức chuẩn',
      },
    ],
  },
  {
    g: 'Retention',
    items: [
      {
        id: 'retMode',
        label: 'Đường giữ chân',
        type: 'select',
        opts: [
          ['file', 'Theo file gốc (240 ngày)'],
          ['moc', 'Theo mốc D1/D3/D7/D14/D30'],
        ],
        hint: 'File gốc dùng bảng giữ chân riêng 240 ngày, hết ngày 240 thì về 0. Chỉ khi chọn «Theo mốc» thì 7 ô bên dưới mới có tác dụng.',
      },
      { id: 'd1', label: 'Giữ chân ngày 1 (D1)', type: 'pct', moc: true },
      { id: 'd3', label: 'Giữ chân ngày 3 (D3)', type: 'pct', moc: true },
      { id: 'd7', label: 'Giữ chân ngày 7 (D7)', type: 'pct', moc: true },
      { id: 'd14', label: 'Giữ chân ngày 14 (D14)', type: 'pct', moc: true },
      { id: 'd30', label: 'Giữ chân ngày 30 (D30)', type: 'pct', moc: true },
      { id: 'tail', label: 'Đuôi sau D30 (giữ lại mỗi ngày)', type: 'pct', moc: true },
      {
        id: 'minRet',
        label: 'Sàn giữ chân (không xuống dưới)',
        type: 'pct',
        moc: true,
        hint: 'Bản gốc để 0,4%/ngày',
      },
    ],
  },
  {
    g: 'Quảng cáo trong game (IAA)',
    adv: true,
    items: [
      { id: 'viewsAd', label: 'Lượt xem ads mỗi user/ngày', type: 'num', hint: 'Bản gốc để 5' },
      {
        id: 'ecpmUsd',
        label: 'Giá ads (eCPM, USD)',
        type: 'usd',
        hint: 'Bản gốc để 0,95 USD · không chịu VAT, không chia share dev',
      },
    ],
  },
  {
    g: 'Hình dạng doanh thu theo tuổi user',
    adv: true,
    items: [
      { id: 'ltvT1', label: 'Tuần 1 (ngày 1–5)', type: 'pct', hint: '% so với ngày đầu' },
      { id: 'ltvT2', label: 'Tuần 2 (ngày 6–12)', type: 'pct' },
      { id: 'ltvT3', label: 'Tuần 3 (ngày 13–20)', type: 'pct' },
      { id: 'ltvDuoi', label: 'Từ ngày 21 (mức đuôi)', type: 'pct' },
      {
        id: 'ltvDuoi2',
        label: 'Từ ngày 120',
        type: 'pct',
        hint: 'Bản gốc 50%: user vào từ ngày 2 trở đi, từ ngày 120 còn 50%. Nhóm vào ngày OB thì giữ nguyên 60% tới hết',
      },
      {
        id: 'ltvNgay',
        label: 'Đuôi kéo dài bao nhiêu ngày',
        type: 'num',
        hint: 'Bản gốc 149 ngày',
      },
      {
        id: 'heSoThang1',
        label: 'Hệ số tiền ads 7 ngày đầu',
        type: 'pct',
        hint: 'Bản gốc cộng 10% cho 7 ngày cao điểm đầu tiên',
      },
    ],
  },
  {
    g: 'Khớp bản gốc (số của file)',
    adv: true,
    items: [
      {
        id: 'heSoOB',
        label: 'Hệ số giữ chân nhóm vào ngày OB',
        type: 'pct',
        hint: 'File gốc để 120% cho nhóm vào đúng ngày mở game. Gõ 100 = tắt',
      },
      { id: 'soNgayOB', label: 'Số ngày áp hệ số OB', type: 'num', hint: 'File gốc: 119 ngày' },
      {
        id: 'taxAdsCuoi',
        label: 'Thuế ads tháng cuối',
        type: 'pct',
        hint: 'File gốc: tháng cuối lấy 5% thay vì 7%',
      },
    ],
  },
  {
    g: 'Doanh thu, thuế, phí, chia sẻ',
    adv: true,
    items: [
      {
        id: 'storeShareM1',
        label: 'Tỉ trọng Store tháng 1',
        type: 'pct',
        hint: 'Bản gốc 20% → 15% → 10%',
      },
      { id: 'storeShareM2', label: 'Tỉ trọng Store tháng 2', type: 'pct' },
      { id: 'storeShare', label: 'Tỉ trọng Store từ tháng 3', type: 'pct' },
      { id: 'webShare', label: 'Tỉ trọng Web', type: 'pct' },
      {
        id: 'heSoOnG',
        label: 'Hệ số OnG (doanh thu IAP ÷ OnG)',
        type: 'pct',
        hint: 'Bản gốc 117%',
      },
      { id: 'heSoDoiSoat', label: 'Hệ số đối soát với Dev', type: 'pct', hint: 'Bản gốc 105,88%' },
      {
        id: 'storeTruDoiSoat',
        label: 'Phần Store bị trừ khi đối soát',
        type: 'pct',
        hint: 'Bản gốc 70%',
      },
      { id: 'vatRate', label: 'Thuế VAT', type: 'pct' },
      {
        id: 'vatStore',
        label: 'Phần Store chịu VAT',
        type: 'pct',
        hint: 'Bản gốc 85% · Web chịu 100%',
      },
      {
        id: 'fee',
        label: 'Phí cổng thanh toán',
        type: 'pct',
        hint: 'Bản gốc 5,5% trên doanh thu IAP',
      },
      { id: 'taxAds', label: 'Thuế kênh quảng cáo', type: 'pct', hint: 'GG/FB/TikTok, bản gốc 7%' },
      { id: 'shareDev', label: 'Share dev', type: 'pct', hint: 'Bản gốc 20% doanh thu đối soát' },
      { id: 'shareDevTier2', label: 'Share dev phần vượt mốc', type: 'pct', hint: 'Bản gốc để 0%' },
    ],
  },
  {
    g: 'Chi phí cố định và một lần',
    adv: true,
    items: [
      {
        id: 'mg',
        label: 'Tạm ứng doanh thu (MG)',
        type: 'usd',
        hint: 'Trả gọn trong tháng 1 như file',
      },
      {
        id: 'nguongShare',
        label: 'Mốc đối soát để đổi tỉ lệ share',
        type: 'usd',
        hint: 'Bản gốc 1.000.000 USD',
      },
      { id: 'lf', label: 'Phí license (LF)', type: 'usd' },
      { id: 'fx', label: 'Tỉ giá USD/VND', type: 'money' },
      {
        id: 'preLaunch',
        label: 'Chi phí trước khi mở game',
        type: 'money',
        hint: 'Lương, branding, phí khác của 4 tháng chuẩn bị — dồn vào tháng 1',
      },
      { id: 'salaryM1', label: 'Quỹ lương mỗi tháng', type: 'money' },
      { id: 'mucLuong', label: 'Lương từ tháng 13 bằng', type: 'pct' },
      { id: 'serverM1', label: 'Server tháng 1', type: 'money' },
      { id: 'serverM2', label: 'Server tháng 2', type: 'money' },
      { id: 'serverMth', label: 'Server mỗi tháng (tới tháng 12)', type: 'money' },
      { id: 'serverLate', label: 'Server từ tháng 13', type: 'money' },
      { id: 'communityM1', label: 'Cộng đồng 3 tháng đầu', type: 'money' },
      { id: 'communityMth', label: 'Cộng đồng tháng 4–12', type: 'money' },
      { id: 'communityLate', label: 'Cộng đồng từ tháng 13', type: 'money' },
      { id: 'brandingM1', label: 'Branding tháng mở game', type: 'money' },
      {
        id: 'brandingMth',
        label: 'Branding các tháng sau',
        type: 'money',
        hint: 'Bản gốc rải mỗi 3 tháng',
      },
      {
        id: 'marketingMth',
        label: 'Marketing mỗi tháng',
        type: 'money',
        hint: 'Ngoài tiền ads · Bida không dùng',
      },
      { id: 'otherMth', label: 'Chi phí khác mỗi tháng', type: 'money', hint: 'Bida không dùng' },
      {
        id: 'otherOne',
        label: 'Chi phí khác một lần',
        type: 'money',
        hint: 'Bản gốc để vào tháng 12',
      },
      { id: 'phiQuanLy', label: 'Phí quản lý mỗi tháng', type: 'money' },
      { id: 'mucPhiQuanLy', label: 'Phí quản lý từ tháng 13 bằng', type: 'pct' },
    ],
  },
];
