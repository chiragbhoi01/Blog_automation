function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlLines: string[] = [];
  let inList = false;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    if (rawLine === undefined) continue;
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      if (inTable) {
        htmlLines.push('</tbody></table>');
        inTable = false;
      }
      continue;
    }

    // Markdown Table rows
    if (line.startsWith('|')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      if (line.includes('---')) continue;

      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        const colGroup =
          '<colgroup>' +
          '<col style="min-width: 120px;">' +
          '<col style="min-width: 150px;">' +
          '<col style="min-width: 150px;">' +
          '<col style="min-width: 120px;">' +
          '<col style="min-width: 120px;">' +
          '<col style="min-width: 100px;">' +
          '<col style="min-width: 110px;">' +
          '</colgroup>';
        const headerCells = cells
          .map((c, idx) => `<th colspan="1" rowspan="1" ${idx === 0 ? 'style="white-space: nowrap;"' : ''} class="p-2 border bg-gray-50 font-bold text-left"><p>${formatInline(c)}</p></th>`)
          .join('');
        htmlLines.push(`<table class="tiptap-table border-collapse my-4 w-full border" style="min-width: 650px;">${colGroup}<tbody><tr>${headerCells}</tr>`);
      } else {
        const bodyCells = cells
          .map((c, idx) => `<td colspan="1" rowspan="1" ${idx === 0 ? 'style="white-space: nowrap; font-weight: 600;"' : ''} class="p-2 border align-top"><p>${formatInline(c)}</p></td>`)
          .join('');
        htmlLines.push(`<tr>${bodyCells}</tr>`);
      }
      continue;
    }

    if (inTable) {
      htmlLines.push('</tbody></table>');
      inTable = false;
    }

    // Headers
    if (line.startsWith('# ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h1>${formatInline(line.replace(/^#\s+/, ''))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h2>${formatInline(line.replace(/^##\s+/, ''))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h3>${formatInline(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      htmlLines.push(`<h4>${formatInline(line.replace(/^####\s+/, ''))}</h4>`);
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        inList = true;
        htmlLines.push('<ul>');
      }
      const itemText = line.replace(/^[-*]\s+/, '');
      htmlLines.push(`<li><p>${formatInline(itemText)}</p></li>`);
      continue;
    }

    if (inList) {
      htmlLines.push('</ul>');
      inList = false;
    }

    // Paragraph
    htmlLines.push(`<p>${formatInline(line)}</p>`);
  }

  if (inList) htmlLines.push('</ul>');
  if (inTable) htmlLines.push('</tbody></table>');

  return htmlLines.join('');
}

export function sanitizeTableHtml(html: string): string {
  if (!html || !html.includes('<table')) return html;

  return html.replace(/<table[\s\S]*?<\/table>/gi, (tableMatch) => {
    // Extract all <tr> rows cleanly
    const trMatches: string[] = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match: RegExpExecArray | null;

    while ((match = trRegex.exec(tableMatch)) !== null) {
      trMatches.push(match[1] || '');
    }

    if (trMatches.length === 0) return tableMatch;

    const colGroup =
      '<colgroup>' +
      '<col style="min-width: 120px;">' +
      '<col style="min-width: 150px;">' +
      '<col style="min-width: 150px;">' +
      '<col style="min-width: 120px;">' +
      '<col style="min-width: 120px;">' +
      '<col style="min-width: 100px;">' +
      '<col style="min-width: 110px;">' +
      '</colgroup>';

    const cleanRows = trMatches.map((trContent, rowIdx) => {
      let cellIdx = 0;
      const cleanCells = trContent.replace(/<(th|td)([^>]*)>([\s\S]*?)<\/\1>/gi, (cMatch, tag, attrs, text) => {
        cellIdx++;
        const textContent = text.replace(/<\/?p>/gi, '').trim();
        const formatted = `<p>${textContent}</p>`;

        if (rowIdx === 0 || tag.toLowerCase() === 'th') {
          const style = cellIdx === 1 ? 'style="white-space: nowrap;"' : '';
          return `<th colspan="1" rowspan="1" ${style} class="p-2 border bg-gray-50 font-bold text-left">${formatted}</th>`;
        } else {
          const style = cellIdx === 1 ? 'style="white-space: nowrap; font-weight: 600;"' : '';
          return `<td colspan="1" rowspan="1" ${style} class="p-2 border align-top">${formatted}</td>`;
        }
      });

      return `<tr>${cleanCells}</tr>`;
    });

    return `<table class="tiptap-table border-collapse my-4 w-full border" style="min-width: 650px;">${colGroup}<tbody>${cleanRows.join('')}</tbody></table>`;
  });
}

export const markdownToTipTapHtml = convertMarkdownToHtml;
