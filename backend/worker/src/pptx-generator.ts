import PptxGenJS from 'pptxgenjs';

// Color Palette - Modern Dark Theme
const COLORS = {
  BG: '111827', // slate-900
  CARD: '1F2937', // slate-800
  BORDER: '374151', // slate-700
  TEXT_MAIN: 'F9FAFB', // gray-50
  TEXT_MUTED: '9CA3AF', // gray-400
  ACCENT_PRIMARY: '00E5FF', // Neon Cyan
  ACCENT_SECONDARY: 'FF6B35', // Neon Orange
  ACCENT_GOOD: '10B981', // Emerald Green
};

const FONT_TITLE = 'Trebuchet MS';
const FONT_BODY = 'Calibri';

function addHeader(slide: PptxGenJS.Slide, titleText: string, categoryText?: string) {
  slide.addText(titleText, {
    x: 0.75,
    y: 0.5,
    w: 11.833,
    h: 0.8,
    fontSize: 28,
    fontFace: FONT_TITLE,
    bold: true,
    color: COLORS.ACCENT_PRIMARY,
  });

  if (categoryText) {
    slide.addText(categoryText.toUpperCase(), {
      x: 0.75,
      y: 1.0,
      w: 11.833,
      h: 0.3,
      fontSize: 10,
      fontFace: FONT_BODY,
      bold: true,
      color: COLORS.TEXT_MUTED,
    });
  }

  // Accent line
  slide.addShape('rect', {
    x: 0.75,
    y: 1.35,
    w: 11.833,
    h: 0.02,
    fill: { color: COLORS.BORDER },
  });
}

function createTitleSlide(prs: PptxGenJS, title: string, genre: string, competitors: string[]) {
  const slide = prs.addSlide();
  slide.background = { fill: COLORS.BG };

  // Left accent border
  slide.addShape('rect', {
    x: 0.75,
    y: 2.2,
    w: 0.08,
    h: 3.0,
    fill: { color: COLORS.ACCENT_PRIMARY },
  });

  // Title
  slide.addText(title, {
    x: 1.0,
    y: 2.1,
    w: 11.0,
    h: 1.2,
    fontSize: 44,
    fontFace: FONT_TITLE,
    bold: true,
    color: COLORS.TEXT_MAIN,
  });

  // Subtitle
  slide.addText(`Báo cáo Đánh giá Sản phẩm  |  Thể loại: ${genre}`, {
    x: 1.0,
    y: 3.3,
    w: 11.0,
    h: 0.5,
    fontSize: 18,
    fontFace: FONT_BODY,
    color: COLORS.ACCENT_SECONDARY,
  });

  // Competitors
  if (competitors.length > 0) {
    slide.addText(`Đối thủ cạnh tranh chính:  ${competitors.join(', ')}`, {
      x: 1.0,
      y: 4.0,
      w: 11.0,
      h: 0.4,
      fontSize: 12,
      fontFace: FONT_BODY,
      color: COLORS.TEXT_MUTED,
    });
  }
}

function createScorecardSlide(prs: PptxGenJS, slideTitle: string, bulletPoints: string[]) {
  const slide = prs.addSlide();
  slide.background = { fill: COLORS.BG };
  addHeader(slide, slideTitle, 'Đánh giá chất lượng');

  // Extract scores
  const scores: { criteria: string; score: number }[] = [];
  for (const line of bulletPoints) {
    const match = line.match(/-\s*\*\*(.*?)\*\*:\s*(\d+(?:\.\d+)?)\s*\/\s*5\.0/);
    if (match) {
      scores.push({ criteria: match[1].trim(), score: parseFloat(match[2]) });
    }
  }

  if (scores.length === 0) {
    createBulletSlide(prs, slideTitle, bulletPoints);
    return;
  }

  const yStart = 1.8;
  const spacing = scores.length > 7 ? 0.48 : 0.65;
  const barHeight = 0.12;

  scores.slice(0, 10).forEach((item, idx) => {
    const yPos = yStart + idx * spacing;

    // Score color
    let scoreColor = COLORS.ACCENT_SECONDARY;
    if (item.score >= 4.0) scoreColor = COLORS.ACCENT_GOOD;
    else if (item.score >= 3.0) scoreColor = COLORS.ACCENT_PRIMARY;

    // Label
    slide.addText(
      [
        {
          text: item.criteria,
          options: { fontSize: 13, fontFace: FONT_BODY, bold: true, color: COLORS.TEXT_MAIN },
        },
        {
          text: `  (${item.score}/5.0)`,
          options: { fontSize: 13, fontFace: FONT_BODY, bold: true, color: scoreColor },
        },
      ],
      { x: 0.75, y: yPos - 0.1, w: 5.5, h: 0.45 },
    );

    // Background bar
    slide.addShape('rect', {
      x: 6.5,
      y: yPos + 0.06,
      w: 6.0,
      h: barHeight,
      fill: { color: COLORS.BORDER },
    });

    // Fill bar
    const fillWidth = 6.0 * (item.score / 5.0);
    if (fillWidth > 0) {
      slide.addShape('rect', {
        x: 6.5,
        y: yPos + 0.06,
        w: fillWidth,
        h: barHeight,
        fill: { color: scoreColor },
      });
    }
  });
}

function createColumnGridSlide(
  prs: PptxGenJS,
  slideTitle: string,
  sections: { title: string; content: string }[],
  categoryText = 'Chi tiết phân tích',
) {
  const slide = prs.addSlide();
  slide.background = { fill: COLORS.BG };
  addHeader(slide, slideTitle, categoryText);

  if (sections.length === 0) return;

  const cols = Math.min(3, sections.length);
  const totalWidth = 11.833;
  const gap = 0.4;
  const width = (totalWidth - gap * (cols - 1)) / cols;
  const yPos = 1.8;
  const height = 4.9;

  sections.slice(0, cols).forEach((section, idx) => {
    const xPos = 0.75 + idx * (width + gap);
    const accentColor = idx % 2 === 0 ? COLORS.ACCENT_PRIMARY : COLORS.ACCENT_SECONDARY;

    // Card background
    slide.addShape('roundRect', {
      x: xPos,
      y: yPos,
      w: width,
      h: height,
      fill: { color: COLORS.CARD },
      line: { color: COLORS.BORDER, width: 1.5 },
      rectRadius: 0.1,
    });

    // Section title
    slide.addText(section.title, {
      x: xPos + 0.2,
      y: yPos + 0.2,
      w: width - 0.4,
      h: 0.5,
      fontSize: 16,
      fontFace: FONT_TITLE,
      bold: true,
      color: accentColor,
    });

    // Content lines
    const lines = section.content.split('\n').filter((l) => l.trim());
    const textItems = lines.map((line) => ({
      text:
        line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')
          ? '• ' + line.slice(2).trim()
          : line,
      options: {
        fontSize: 12,
        fontFace: FONT_BODY,
        color: COLORS.TEXT_MAIN,
        breakLine: true,
        paraSpaceAfter: 6,
      },
    }));

    slide.addText(textItems, {
      x: xPos + 0.2,
      y: yPos + 0.8,
      w: width - 0.4,
      h: height - 1.0,
      valign: 'top',
    });
  });
}

function createBulletSlide(
  prs: PptxGenJS,
  slideTitle: string,
  bulletPoints: string[],
  categoryText = 'Nghiên cứu & Hành động',
) {
  const slide = prs.addSlide();
  slide.background = { fill: COLORS.BG };
  addHeader(slide, slideTitle, categoryText);

  const textItems: { text: string; options: Record<string, unknown> }[] = [];

  for (const line of bulletPoints) {
    const clean = line.trim();
    if (!clean) continue;

    const item: { text: string; options: Record<string, unknown> } = { text: '', options: {} };

    if (clean.startsWith('### ')) {
      item.text = clean.slice(4).trim();
      item.options = {
        fontSize: 18,
        fontFace: FONT_TITLE,
        bold: true,
        color: COLORS.ACCENT_PRIMARY,
        breakLine: true,
        paraSpaceBefore: 8,
        paraSpaceAfter: 8,
      };
    } else if (clean.startsWith('## ')) {
      item.text = clean.slice(3).trim();
      item.options = {
        fontSize: 20,
        fontFace: FONT_TITLE,
        bold: true,
        color: COLORS.ACCENT_SECONDARY,
        breakLine: true,
        paraSpaceBefore: 12,
      };
    } else if (clean.startsWith('- ') || clean.startsWith('* ') || clean.startsWith('• ')) {
      item.text = '• ' + clean.slice(2).trim();
      item.options = {
        fontSize: 15,
        fontFace: FONT_BODY,
        color: COLORS.TEXT_MAIN,
        breakLine: true,
        paraSpaceAfter: 8,
      };
    } else if (/^\d+\.\s/.test(clean)) {
      item.text = clean;
      item.options = {
        fontSize: 15,
        fontFace: FONT_BODY,
        bold: true,
        color: COLORS.TEXT_MAIN,
        breakLine: true,
        paraSpaceAfter: 10,
      };
    } else {
      item.text = clean;
      item.options = {
        fontSize: 15,
        fontFace: FONT_BODY,
        color: COLORS.TEXT_MAIN,
        breakLine: true,
        paraSpaceAfter: 12,
      };
    }

    textItems.push(item);
  }

  slide.addText(textItems, {
    x: 0.75,
    y: 1.8,
    w: 11.833,
    h: 4.8,
    valign: 'top',
  });
}

function parseSlideContent(slideText: string) {
  const parts = slideText.split(/###\s*(?:📍)?\s*(.*?)\n/);
  const intro = parts[0].trim();
  const sections: { title: string; content: string }[] = [];

  for (let i = 1; i < parts.length; i += 2) {
    sections.push({
      title: parts[i].trim(),
      content: (parts[i + 1] || '').trim(),
    });
  }

  return { intro, sections };
}

export async function generatePptxFromMarkdown(markdownContent: string): Promise<Uint8Array> {
  const prs = new PptxGenJS();
  prs.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
  prs.layout = 'WIDE';

  // Parse metadata
  let projectName = 'Unknown Project';
  let genre = 'Casual';
  let competitors: string[] = [];

  const titleMatch = markdownContent.match(/^#\s*Báo cáo Đánh giá sản phẩm:\s*(.*?)\n/m);
  if (titleMatch) projectName = titleMatch[1].trim();

  const slideBlocks = markdownContent.split('---');
  const firstBlock = slideBlocks[0];

  for (const line of firstBlock.split('\n')) {
    const lower = line.toLowerCase();
    if (lower.includes('thể loại') || lower.includes('genre')) {
      const val = line.split(':').pop()?.trim();
      if (val) genre = val;
    } else if (lower.includes('đối thủ') || lower.includes('competitors')) {
      const val = line.split(':').pop()?.trim();
      if (val && val !== 'Không có (N/A)') {
        competitors = val
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean);
      }
    }
  }

  // Title slide
  createTitleSlide(prs, projectName, genre, competitors);

  // Parse remaining slides
  for (const block of slideBlocks.slice(1)) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    let slideHeader = 'Slide Content';
    let headerIdx = -1;

    for (let idx = 0; idx < lines.length; idx++) {
      if (lines[idx].startsWith('## Slide')) {
        slideHeader = lines[idx].replace(/## Slide \d+:\s*/, '').trim();
        headerIdx = idx;
        break;
      }
    }

    const contentLines = headerIdx !== -1 ? lines.slice(headerIdx + 1) : lines;
    const contentText = contentLines.join('\n');

    // Scorecard slide
    if (
      slideHeader.toLowerCase().includes('scorecard') ||
      slideHeader.toLowerCase().includes('bảng điểm')
    ) {
      createScorecardSlide(prs, slideHeader, contentLines);
      continue;
    }

    // Column grid or bullet slide
    const { sections } = parseSlideContent(contentText);

    if (sections.length > 0) {
      let category = 'Phân tích chi tiết';
      if (slideHeader.toLowerCase().includes('swot')) category = 'Ma trận SWOT';
      else if (
        slideHeader.toLowerCase().includes('hành động') ||
        slideHeader.toLowerCase().includes('hành vi')
      )
        category = 'Kế hoạch hành động';

      createColumnGridSlide(prs, slideHeader, sections, category);
    } else {
      let category = 'Tổng kết thông tin';
      if (
        slideHeader.toLowerCase().includes('nghiên cứu') ||
        slideHeader.toLowerCase().includes('đối thủ')
      )
        category = 'Nghiên cứu đối thủ';
      else if (
        slideHeader.toLowerCase().includes('hành động') ||
        slideHeader.toLowerCase().includes('action')
      )
        category = 'Đề xuất hành động';

      createBulletSlide(prs, slideHeader, contentLines, category);
    }
  }

  // Generate as buffer
  const buffer = await prs.write({ outputType: 'uint8array' });
  return buffer as Uint8Array;
}
