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

export interface SentimentDataType {
  sentimentScore?: number;
  sentimentSummary?: string;
  overallLabel?: string;
  positiveCount?: number;
  negativeCount?: number;
  neutralCount?: number;
  totalMentions?: number;
  redditMentions?: Array<{ subreddit: string; title: string; url: string; score: number; sentiment: number }>;
  twitterMentions?: Array<{ tweet: string; sentiment: number }>;
}

export function buildSentimentSection(sentimentData?: SentimentDataType): string {
  if (!sentimentData || sentimentData.totalMentions === undefined) {
    return `\n\n---\n\n## 8. Social Sentiment (Reddit & Twitter)\n\n*Chưa có dữ liệu. Sử dụng nút "Analyze Sentiment" để thu thập.*\n`;
  }

  const { sentimentScore, sentimentSummary, positiveCount, negativeCount, neutralCount, totalMentions, redditMentions, twitterMentions } = sentimentData;
  const score = (typeof sentimentScore === 'number' ? sentimentScore : 0);
  const pos = positiveCount ?? 0;
  const neg = negativeCount ?? 0;
  const neu = neutralCount ?? 0;
  const total = totalMentions ?? 0;

  const sentimentEmoji = score > 0.15 ? '🟢 Positive' : score < -0.15 ? '🔴 Negative' : '🟡 Neutral';

  let md = `\n\n---\n\n## 8. Social Sentiment (Reddit & Twitter)\n\n`;
  md += `**Overall Score:** ${score.toFixed(3)} — ${sentimentEmoji}\n\n`;
  md += `| Metric | Value |\n|---|---|\n`;
  md += `| **Total mentions** | ${total} |\n`;
  md += `| **Positive** | ${pos} |\n`;
  md += `| **Negative** | ${neg} |\n`;
  md += `| **Neutral** | ${neu} |\n\n`;
  md += `${sentimentSummary || ''}\n\n`;

  if (redditMentions && redditMentions.length > 0) {
    md += `### 🔴 Reddit Mentions (${redditMentions.length})\n\n`;
    md += `| Subreddit | Title | Score | Sentiment |\n|---|---|---|---|\n`;
    const displayed = redditMentions.slice(0, 10);
    for (const m of displayed) {
      const sentLabel = (m.sentiment ?? 0) > 0.15 ? '✅' : (m.sentiment ?? 0) < -0.15 ? '❌' : '➖';
      md += `| r/${m.subreddit} | ${(m.title || '').slice(0, 80)} | ${m.score ?? 0} | ${sentLabel} |\n`;
    }
    md += `\n`;
  }

  if (twitterMentions && twitterMentions.length > 0) {
    md += `### 🐦 Twitter Mentions (${twitterMentions.length})\n\n`;
    for (const t of twitterMentions) {
      const sentLabel = (t.sentiment ?? 0) > 0.15 ? '✅' : (t.sentiment ?? 0) < -0.15 ? '❌' : '➖';
      md += `- ${sentLabel} ${(t.tweet || '').slice(0, 120)}\n`;
    }
    md += `\n`;
  }

  return md;
}

export function buildStandardReportMarkdown(
  info: Record<string, unknown>,
  source: 'apk' | 'product',
  sentimentData?: SentimentDataType,
): string {
  let md = `# Báo cáo đánh giá: ${info.name || 'Unknown'}\n`;
  md += `*Nguồn: ${source === 'apk' ? 'APK Analysis' : 'Product Search'} — ${new Date().toLocaleString()}*\n\n`;

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

  md += buildSentimentSection(sentimentData);

  const rawDesc = info.description;
  if (typeof rawDesc === 'string' && rawDesc) {
    const desc = rawDesc.length > 400 ? rawDesc.slice(0, 400) + '...' : rawDesc;
    md += `\n---\n\n`;
    md += `## Mô tả sản phẩm\n\n${desc}\n`;
  }

  return md;
}

export function extractPlayStorePackageName(url: string): string | null {
  const match = url.match(/play\.google\.com\/store\/apps\/details\?id=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function buildVietnameseHtml(md: string): string {
  const lines = md.split('\n');
  let title = 'Báo Cáo Phân Tích';
  let date = new Date().toLocaleDateString('vi-VN');

  for (const line of lines) {
    if (line.startsWith('# Báo cáo đánh giá:')) {
      title = 'Báo Cáo Đánh Giá: ' + line.replace('# Báo cáo đánh giá:', '').trim();
    }
    if (line.startsWith('*Nguồn:')) {
      date = line
        .replace(/\*Nguồn:.*?—\s*/, '')
        .replace(/\*/g, '')
        .trim();
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 30px; line-height: 1.7; }
  h1 { font-size: 22px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; }
  h2 { font-size: 18px; color: #4338ca; margin-top: 24px; }
  h3 { font-size: 15px; color: #1e293b; margin-top: 18px; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
  p { margin: 6px 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px; }
  td { border: 1px solid #e2e8f0; padding: 8px 12px; vertical-align: top; }
  tr:nth-child(even) { background: #f8fafc; }
  li { font-size: 13px; margin: 3px 0; }
  pre, code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-family: 'Courier New', monospace; white-space: pre-wrap; word-break: break-all; }
  .meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
  .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  .code-block { background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 6px; font-size: 11px; margin: 10px 0; white-space: pre-wrap; word-break: break-all; }
  .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 10px 0; border-radius: 4px; font-size: 12px; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Ngày tạo: ${date}</p>

  ${(function () {
    let html = '';
    let inCode = false;
    let codeContent = '';
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[] = [];

    const flushTable = () => {
      if (tableHeaders.length && tableRows.length) {
        html +=
          '<table><tr>' +
          tableHeaders.map((h) => '<td><strong>' + h + '</strong></td>').join('') +
          '</tr>' +
          tableRows.join('') +
          '</table>';
      }
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('```')) {
        if (inCode) {
          html += '<div class="code-block">' + codeContent + '</div>';
          codeContent = '';
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }
      if (inCode) {
        codeContent += line + '\n';
        continue;
      }
      if (line.startsWith('# ')) continue;
      if (line.startsWith('*Nguồn:')) continue;
      if (line.startsWith('---')) {
        flushTable();
        html += '<hr/>';
        continue;
      }
      if (line.trim() === '') {
        flushTable();
        continue;
      }

      if (line.startsWith('| ') && line.endsWith('|')) {
        const cells = line
          .split('|')
          .filter(Boolean)
          .map((c) => c.trim().replace(/\*\*/g, '').replace(/`/g, ''));
        if (i + 1 < lines.length && lines[i + 1].includes('---')) {
          tableHeaders = cells;
          inTable = true;
          i++;
          continue;
        }
        if (inTable) {
          tableRows.push('<tr>' + cells.map((c) => '<td>' + c + '</td>').join('') + '</tr>');
        }
        continue;
      }

      flushTable();

      if (line.startsWith('## ')) {
        html += '<h2>' + line.replace('## ', '') + '</h2>';
        continue;
      }
      if (line.startsWith('### ')) {
        html += '<h3>' + line.replace('### ', '') + '</h3>';
        continue;
      }
      if (line.startsWith('- ')) {
        html += '<li>' + line.replace('- ', '') + '</li>';
        continue;
      }
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      if (
        processed.startsWith('⚠️') ||
        processed.startsWith('🌐') ||
        processed.startsWith('❌') ||
        processed.startsWith('✅')
      ) {
        html += '<div class="warning">' + processed + '</div>';
      } else {
        html += '<p>' + processed + '</p>';
      }
    }

    flushTable();
    return html;
  })()}

  <div class="footer">
    <p>Báo cáo được tạo tự động bởi ClientSideApkParser (JSZip) — Dữ liệu không rời khỏi trình duyệt của bạn.</p>
  </div>
</body>
</html>`;
}
