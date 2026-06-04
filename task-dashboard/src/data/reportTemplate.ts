export interface ReportSection {
  id: string;
  label: string;
  fields: ReportField[];
}

export interface ReportField {
  id: string;
  label: string;
  description: string;
  apkSource?: string;
  linkSource?: string;
}

export const STANDARD_SECTIONS: ReportSection[] = [
  {
    id: 'product-overview',
    label: 'Tổng quan sản phẩm',
    fields: [
      {
        id: 'app-name',
        label: 'Tên ứng dụng',
        description: 'Tên sản phẩm',
        apkSource: 'Extracted from APK',
        linkSource: 'Google Play',
      },
      {
        id: 'package-name',
        label: 'Package Name',
        description: 'Mã định danh ứng dụng',
        apkSource: 'Extracted from APK',
        linkSource: 'Google Play',
      },
      {
        id: 'version',
        label: 'Phiên bản',
        description: 'Version hiện tại',
        apkSource: 'Extracted from APK',
        linkSource: 'Google Play',
      },
      {
        id: 'developer',
        label: 'Nhà phát triển',
        description: 'Dev / Publisher',
        apkSource: 'Google Play lookup',
        linkSource: 'Google Play',
      },
      {
        id: 'category',
        label: 'Thể loại',
        description: 'Genre của sản phẩm',
        apkSource: 'Google Play lookup',
        linkSource: 'Google Play',
      },
      {
        id: 'rating',
        label: 'Đánh giá',
        description: 'Rating trên store',
        apkSource: 'Google Play lookup',
        linkSource: 'Google Play',
      },
      {
        id: 'installs',
        label: 'Lượt cài đặt',
        description: 'Total installs',
        apkSource: 'Google Play lookup',
        linkSource: 'Google Play',
      },
      {
        id: 'size',
        label: 'Dung lượng',
        description: 'File size',
        apkSource: 'Extracted from APK',
        linkSource: 'Google Play',
      },
      {
        id: 'updated',
        label: 'Cập nhật',
        description: 'Ngày cập nhật gần nhất',
        apkSource: 'Google Play lookup',
        linkSource: 'Google Play',
      },
      {
        id: 'os',
        label: 'Hệ điều hành',
        description: 'Nền tảng hỗ trợ',
        apkSource: 'From APK manifest',
        linkSource: 'From store listing',
      },
    ],
  },
  {
    id: 'technical-architecture',
    label: 'Kiến trúc kỹ thuật',
    fields: [
      {
        id: 'activities',
        label: 'Entry Points (Activities)',
        description: 'Số lượng màn hình/activity',
        apkSource: 'Extracted from APK',
      },
      {
        id: 'permissions',
        label: 'Permissions',
        description: 'Quyền truy cập',
        apkSource: 'Extracted from APK',
      },
      {
        id: 'api-endpoints',
        label: 'API Endpoints',
        description: 'Địa chỉ mạng từ bytecode',
        apkSource: 'Extracted from APK',
      },
      {
        id: 'suspicious-keys',
        label: 'Potential Secrets',
        description: 'Khóa/thông tin nhạy cảm',
        apkSource: 'Extracted from APK',
      },
    ],
  },
  {
    id: 'content-context',
    label: 'Nội dung & Bối cảnh',
    fields: [
      { id: 'ip-strength', label: 'Nhận định về IP', description: 'Sức mạnh thương hiệu' },
      {
        id: 'vn-market-fit',
        label: 'Phù hợp thị hiếu VN?',
        description: 'Khả năng tiếp cận thị trường Việt Nam',
      },
      {
        id: 'comparison',
        label: 'So sánh game cùng thể loại tại VN',
        description: 'Điểm mạnh/yếu so với đối thủ',
      },
      { id: 'target-age', label: 'Độ tuổi mục tiêu', description: 'Đối tượng người chơi chính' },
      { id: 'community', label: 'Cộng đồng tại VN', description: 'Quy mô cộng đồng' },
    ],
  },
  {
    id: 'gameplay',
    label: 'Cách chơi & Cơ chế',
    fields: [
      { id: 'tutorial', label: 'Hướng dẫn tân thủ', description: 'Chất lượng hướng dẫn ban đầu' },
      { id: 'combat', label: 'Đặc điểm chiến đấu', description: 'Hệ thống PvP & PvE' },
      { id: 'development', label: 'Hệ thống phát triển', description: 'Cơ chế nâng cấp' },
      { id: 'strategy', label: 'Yếu tố chiến lược', description: 'Chiều sâu chiến thuật' },
    ],
  },
  {
    id: 'experience',
    label: 'Trải nghiệm người dùng',
    fields: [
      {
        id: 'initial-experience',
        label: 'Trải nghiệm ban đầu',
        description: 'Cảm nhận 10 phút đầu',
      },
      { id: 'ui-ux', label: 'UI/UX', description: 'Bố cục, màu sắc, dễ nhìn' },
      { id: 'graphics', label: 'Đồ họa & Âm thanh', description: 'Chất lượng hình ảnh, âm thanh' },
      { id: 'performance', label: 'Hiệu năng', description: 'Mượt mà, tương thích thiết bị' },
    ],
  },
  {
    id: 'interaction',
    label: 'Tương tác',
    fields: [
      { id: 'individual', label: 'Cá nhân - Cá nhân', description: 'Kết bạn, nhắn tin, 1v1' },
      { id: 'individual-group', label: 'Cá nhân - Nhóm', description: 'Bang hội, tổ đội' },
      { id: 'group-group', label: 'Nhóm - Nhóm', description: 'Bang chiến, liên server' },
    ],
  },
  {
    id: 'economy',
    label: 'Hệ thống Kinh tế',
    fields: [
      { id: 'top-up', label: 'Tài nguyên nạp', description: 'Gói nạp, ưu đãi' },
      { id: 'spending', label: 'Cài đặt tiêu thụ', description: 'Sự kiện tiêu phí' },
      { id: 'currency', label: 'Các loại tiền', description: 'Đa dạng tiền tệ trong game' },
    ],
  },
  {
    id: 'value',
    label: 'Giá trị & Cân bằng',
    fields: [
      { id: 'attribute-balance', label: 'Cân bằng thuộc tính', description: 'Chỉ số, lực chiến' },
      { id: 'progression-gate', label: 'Thiết kế kẹt ải', description: 'Điểm block tiến độ' },
    ],
  },
  {
    id: 'swot',
    label: 'SWOT Analysis',
    fields: [
      { id: 'strengths', label: 'Strengths', description: 'Điểm mạnh của sản phẩm' },
      { id: 'weaknesses', label: 'Weaknesses', description: 'Điểm yếu cần cải thiện' },
      { id: 'opportunities', label: 'Opportunities', description: 'Cơ hội tại thị trường VN' },
      { id: 'threats', label: 'Threats', description: 'Rủi ro, thách thức' },
    ],
  },
  {
    id: 'conclusion',
    label: 'Kết luận & Đề xuất',
    fields: [
      { id: 'summary', label: 'Đánh giá tổng quan', description: 'Nhận xét chung' },
      { id: 'verdict', label: 'Kết luận', description: 'An toàn / Tiềm năng / Đột phá' },
      { id: 'recommendation', label: 'Đề xuất', description: 'Có đáng mua/phát hành không' },
    ],
  },
];

export function buildStandardReportMarkdown(
  info: Record<string, unknown>,
  source: 'apk' | 'link',
): string {
  let md = `# Báo cáo đánh giá: ${info.name || 'Unknown'}\n`;
  md += `*Nguồn: ${source === 'apk' ? 'APK Analysis' : 'Product Link Search'} — ${new Date().toLocaleString()}*\n\n`;

  md += `---\n\n`;
  md += `## 1. Tổng quan sản phẩm\n\n`;
  md += `| Tiêu chí | Thông tin |\n`;
  md += `|---|---|\n`;
  md += `| **Tên ứng dụng** | ${info.name || 'N/A'} |\n`;
  md += `| **Package** | \`${info.packageName || 'N/A'}\` |\n`;
  if (info.developer) md += `| **Nhà phát triển** | ${info.developer} |\n`;
  if (info.category) md += `| **Thể loại** | ${info.category} |\n`;
  if (info.rating) md += `| **Đánh giá** | ${info.rating} ⭐ |\n`;
  if (info.installs) md += `| **Lượt cài đặt** | ${info.installs} |\n`;
  if (info.updated) md += `| **Cập nhật** | ${info.updated} |\n`;
  if (info.size) md += `| **Dung lượng** | ${info.size} |\n`;

  md += `\n---\n\n`;
  md += `## 2. Nội dung & Bối cảnh\n\n`;
  md += `| Tiêu chí | Đánh giá | Ghi chú |\n`;
  md += `|---|---|---|\n`;
  md += `| **Thể loại** | ${info.category || 'Đang chờ đánh giá'} | Xác định từ thông tin store |\n`;
  md += `| **Phù hợp thị hiếu VN** | Đang chờ đánh giá | Cần phân tích thêm |\n`;
  md += `| **Độ tuổi mục tiêu** | Đang chờ đánh giá | Dựa theo nội dung sản phẩm |\n`;
  md += `| **So sánh đối thủ** | Đang chờ đánh giá | Cần nghiên cứu thị trường |\n`;

  md += `\n---\n\n`;
  md += `## 3. Kiến trúc kỹ thuật\n\n`;
  md += `| Tiêu chí | Thông tin |\n`;
  md += `|---|---|\n`;
  if (source === 'apk') {
    md += `| **Activities** | ${info.activities || 'N/A'} |\n`;
    md += `| **Permissions** | ${info.permissions || 'N/A'} |\n`;
    md += `| **API Endpoints** | ${info.apiEndpoints || 'N/A'} |\n`;
    md += `| **Security Keys** | ${info.suspiciousKeys || 'N/A'} |\n`;
  } else {
    md += `| **Nền tảng** | Android |\n`;
    md += `| **Phân tích chi tiết** | Tải APK để phân tích kỹ thuật đầy đủ |\n`;
  }

  md += `\n---\n\n`;
  md += `## 4. Trải nghiệm & Gameplay\n\n`;
  md += `| Tiêu chí | Nhận xét |\n`;
  md += `|---|---|\n`;
  md += `| **Trải nghiệm ban đầu** | Đang chờ đánh giá từ tester |\n`;
  md += `| **UI/UX** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Đồ họa & Âm thanh** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Hiệu năng** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Cách chơi** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Hướng dẫn tân thủ** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Tương tác** | Đang chờ đánh giá từ tester |\n`;

  md += `\n---\n\n`;
  md += `## 5. Kinh tế & Giá trị\n\n`;
  md += `| Tiêu chí | Nhận xét |\n`;
  md += `|---|---|\n`;
  md += `| **Hệ thống nạp** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Sự kiện tiêu phí** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Cân bằng** | Đang chờ đánh giá từ tester |\n`;
  md += `| **Kẹt ải** | Đang chờ đánh giá từ tester |\n`;

  md += `\n---\n\n`;
  md += `## 6. SWOT Analysis\n\n`;
  md += `### ✅ Strengths\n`;
  md += `- *(Cần bổ sung từ quá trình test)*\n\n`;
  md += `### ⚠️ Weaknesses\n`;
  md += `- *(Cần bổ sung từ quá trình test)*\n\n`;
  md += `### 📈 Opportunities\n`;
  md += `- *(Cần phân tích thị trường)*\n\n`;
  md += `### 🚧 Threats\n`;
  md += `- *(Cần phân tích thị trường)*\n\n`;

  md += `---\n\n`;
  md += `## 7. Kết luận\n\n`;
  md += `| Tiêu chí | Đánh giá |\n`;
  md += `|---|---|\n`;
  md += `| **Tổng quan** | Đang chờ đánh giá |\n`;
  md += `| **Xếp hạng** | Đang chờ đánh giá |\n`;
  md += `| **Đề xuất** | Đang chờ đánh giá |\n`;

  if (info.description) {
    const desc =
      info.description.length > 400 ? info.description.slice(0, 400) + '...' : info.description;
    md += `\n---\n\n`;
    md += `## Mô tả sản phẩm\n\n${desc}\n`;
  }

  return md;
}

export function extractPlayStorePackageName(url: string): string | null {
  const match = url.match(/play\.google\.com\/store\/apps\/details\?id=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
