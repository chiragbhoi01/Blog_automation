import { describe, it, expect } from 'vitest';
import { convertMarkdownToHtml, sanitizeTableHtml } from './markdown-to-html';

describe('Markdown to HTML Table Conversion & Sanitization Pipeline', () => {
  it('should convert markdown comparison tables into valid TipTap HTML tables with colgroup', () => {
    const markdownInput = `
| Tool | Primary Use Case | Starting Price |
|---|---|---|
| Demoly | Interactive Walkthroughs | $8 / creator |
| Loom | Quick Video Shares | $12.50 / user |
`;

    const htmlOutput = convertMarkdownToHtml(markdownInput);

    // Must be valid TipTap table structure
    expect(htmlOutput).toContain('<table class="tiptap-table border-collapse my-4 w-full border" style="min-width: 650px;">');
    expect(htmlOutput).toContain('<colgroup><col style="min-width: 120px;">');
    expect(htmlOutput).toContain('<tbody><tr><th colspan="1" rowspan="1" style="white-space: nowrap;"');
    expect(htmlOutput).toContain('<td colspan="1" rowspan="1" style="white-space: nowrap; font-weight: 600;" class="p-2 border align-top"><p>Demoly</p></td>');

    // MUST NOT contain stray </colgroup> inside <tbody>
    expect(htmlOutput).not.toContain('<tbody></colgroup>');
    expect(htmlOutput).not.toContain('<tbody><col');
  });

  it('should sanitize malformed HTML tables containing stray </colgroup> or stray <p> tags inside <tbody>', () => {
    const malformedHtmlInput = `
<table class="tiptap-table border-collapse my-4 w-full border" style="min-width: 650px;">
  <colgroup><col style="min-width: 100px;"></colgroup>
  <tbody></colgroup>
    <tr><th colspan="1" rowspan="1"><p>Tool</p></th><th colspan="1" rowspan="1"><p>Price</p></th></tr>
    <tr><td colspan="1" rowspan="1"><p>Demoly</p></td><td colspan="1" rowspan="1"><p>$8</p></td></tr>
  </tbody>
</table>
`;

    const sanitizedOutput = sanitizeTableHtml(malformedHtmlInput);

    // Must remove stray </colgroup> from inside <tbody>
    expect(sanitizedOutput).not.toContain('<tbody></colgroup>');
    expect(sanitizedOutput).toContain('<tbody><tr><th');

    // Must enforce clean colgroup before <tbody>
    expect(sanitizedOutput).toContain('<colgroup><col style="min-width: 120px;">');
    expect(sanitizedOutput).toContain('<td colspan="1" rowspan="1" style="white-space: nowrap; font-weight: 600;"');
  });
});
