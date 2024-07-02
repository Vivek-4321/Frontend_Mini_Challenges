import React, { useState, useEffect } from 'react';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const parsedContent = parseMarkdown(markdown);
    setPreview(parsedContent.html);
    setDebugInfo(parsedContent.debug);
  }, [markdown]);

  const parseMarkdown = (md: string): { html: string, debug: string } => {
    let debug = '';

    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const parseTable = (tableText: string) => {
      const rows = tableText.split('\n').filter(row => row.trim() !== '');
      const headers = rows[0].split('|').map(header => header.trim()).filter(Boolean);
      const alignments = rows[1].split('|').map(cell => {
        if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
        if (cell.endsWith(':')) return 'right';
        return 'left';
      }).filter(Boolean);
      const body = rows.slice(2);

      let table = '<table><thead><tr>';
      headers.forEach((header, index) => {
        table += `<th style="text-align: ${alignments[index]}">${escapeHtml(header)}</th>`;
      });
      table += '</tr></thead><tbody>';

      body.forEach(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
        table += '<tr>';
        cells.forEach((cell, index) => {
          table += `<td style="text-align: ${alignments[index]}">${escapeHtml(cell)}</td>`;
        });
        table += '</tr>';
      });

      table += '</tbody></table>';
      return table;
    };

    let parsed = md
      .replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, content) => `<h${hashes.length}>${content}</h${hashes.length}>`)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]+?)```/g, (_, code) => `<pre><code>${escapeHtml(code.trim())}</code></pre>`)
      .replace(/`(.+?)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`)
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[(.+?)\]\((.+?)\)/g, (match, alt, src) => {
        debug += `Found image: alt="${alt}", src="${src}"\n`;
        return `<img alt="${escapeHtml(alt)}" src="${escapeHtml(src)}" style="max-width: 100%; height: auto;" />`;
      })
      .replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>')
      .replace(/(\|.+\|\n)+/g, parseTable)
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
    
    return {
      html: `<p>${parsed}</p>`,
      debug: debug
    };
  };

  return (
    <div className="markdown-editor">
      <textarea
        className="editor"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Enter your Markdown here..."
      />
      <div className="preview-container">
        <div className="preview" dangerouslySetInnerHTML={{ __html: preview }} />
        <pre className="debug-info">{debugInfo}</pre>
      </div>
      <style>{`
        .markdown-editor {
          display: flex;
          height: 100vh;
          background-color: #1e1e1e;
          color: #d4d4d4;
        }
        .editor, .preview-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        .editor {
          background-color: #252526;
          border: none;
          resize: none;
          font-family: monospace;
          font-size: 14px;
          color: #d4d4d4;
        }
        .preview-container {
          display: flex;
          flex-direction: column;
        }
        .preview {
          background-color: #1e1e1e;
          line-height: 1.6;
          flex: 1;
        }
        .debug-info {
          margin-top: 20px;
          padding: 10px;
          background-color: #2d2d2d;
          color: #00ff00;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
        }
        .preview img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1em 0;
          border: 2px solid #f0f;
        }
        .preview h1, .preview h2, .preview h3, .preview h4, .preview h5, .preview h6 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        .preview h1 { font-size: 2em; }
        .preview h2 { font-size: 1.5em; }
        .preview h3 { font-size: 1.25em; }
        .preview h4 { font-size: 1em; }
        .preview h5 { font-size: 0.875em; }
        .preview h6 { font-size: 0.85em; }
        .preview code {
          background-color: #333;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
        }
        .preview pre {
          background-color: #333;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
        }
        .preview pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .preview ul {
          padding-left: 20px;
        }
        .preview a {
          color: #58a6ff;
          text-decoration: none;
        }
        .preview a:hover {
          text-decoration: underline;
        }
        .preview table {
          border-collapse: collapse;
          margin: 15px 0;
        }
        .preview th, .preview td {
          border: 1px solid #555;
          padding: 8px;
        }
        .preview th {
          background-color: #333;
        }
      `}</style>
    </div>
  );
};

export default MarkdownEditor;