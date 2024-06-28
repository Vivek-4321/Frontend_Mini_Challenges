import React from 'react';

interface MarkdownPreviewProps {
    markdown: string;
}

const parseMarkdown = (markdown: string): string => {
    console.log('from editor', markdown);
    const bold = /\*\*(.*?)\*\*/g;
    const italic = /\*(.*?)\*/g;
    const heading = /^(#{1,6})\s*(.*?)$/gm;
    const link = /\[([^\[]+)\]\(([^\)]+)\)/g;
    const image = /!\[([^\[]+)\]\(([^\)]+)\)/g;
    const codeBlock = /```([\s\S]*?)```/g;
    const inlineCode = /`([^`]+)`/g;
    const blockquote = /^>\s*(.*?)$/gm;
    const listItem = /^\s*[-*+]\s+(.*)$/gm;
    const numberedListItem = /^\s*\d+\.\s+(.*)$/gm;
    const table = /^\s*\|(.+)\|$/gm;

    const generateTable = (text: string): string => {
        const rows = text.trim().split('\n');
        let html = '<table><thead>';
        let isHeader = true;

        rows.forEach((row, index) => {
            const cells = row.split('|').filter(cell => cell.trim() !== '');
            const isHeaderRow = cells.every(cell => /^:?-+:?$/.test(cell.trim()));

            if (isHeaderRow) {
                html += '</thead><tbody>';
                isHeader = false;
            } else {
                const cellType = isHeader ? 'th' : 'td';
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<${cellType}>${cell.trim()}</${cellType}>`;
                });
                html += '</tr>';

                if (isHeader && index === rows.length - 1) {
                    html += '</thead><tbody>';
                }
            }
        });

        html += '</tbody></table>';
        return html;
    };

    let html = markdown
        .replace(bold, '<strong>$1</strong>')
        .replace(italic, '<em>$1</em>')
        .replace(heading, (_, hashes, content) => {
            const level = hashes.length;
            return `<h${level}>${content}</h${level}>`;
        })
        .replace(link, '<a href="$2">$1</a>')
        .replace(image, '<img src="$2" alt="$1" />')
        .replace(codeBlock, '<pre><code>$1</code></pre>')
        .replace(inlineCode, '<code>$1</code>')
        .replace(blockquote, '<blockquote>$1</blockquote>')
        .replace(listItem, '<li>$1</li>')
        .replace(numberedListItem, '<li>$1</li>');

    // Handle tables
    html = html.replace(table, (match) => generateTable(match));

    return html;
};

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
    const html = parseMarkdown(markdown);
    return (
        <>
            <style>{`
                .preview {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
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
                .preview strong { font-weight: bold; }
                .preview em { font-style: italic; }
                .preview blockquote {
                    padding: 0 1em;
                    color: #6a737d;
                    border-left: 0.25em solid #dfe2e5;
                }
                    .preview img {
                    max-width: 100%;
                    box-sizing: border-box;
                }
                .preview code {
                    padding: 0.2em 0.4em;
                    margin: 0;
                    font-size: 85%;
                    background-color: rgba(27,31,35,0.05);
                    border-radius: 3px;
                }
                .preview pre {
                    padding: 16px;
                    overflow: auto;
                    font-size: 85%;
                    line-height: 1.45;
                    background-color: black;
                    border-radius: 3px;
                }
                .preview pre code {
                    padding: 0;
                    margin: 0;
                    font-size: 100%;
                    word-break: normal;
                    white-space: pre;
                    background: transparent;
                    border: 0;
                }
                .preview table {
                    border-collapse: collapse;
                    width: 100%;
                    table-layout: fixed; /* This ensures equal column widths */
                }
                .preview table th, .preview table td {
                    padding: 6px 13px;
                    border: 1px solid #dfe2e5;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .preview table tr {
                    background-color: #fff;
                }
                .preview table tr:nth-child(2n) {
                    background-color: #f6f8fa;
                }
                .preview table thead tr {
                    border-top: none;
                    border-bottom: 2px solid #dfe2e5;
                }
                .preview table tbody tr {
                    border: none;
                }
                .preview img {
                    max-width: 100%;
                    box-sizing: content-box;
                }
            `}</style>
            <div
                className="preview"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </>
    );
};