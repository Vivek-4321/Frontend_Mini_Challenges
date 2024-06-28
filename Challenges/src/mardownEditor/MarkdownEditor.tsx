import React, { useState } from 'react';
import { MarkdownPreview } from './MarkdownPreview';

const MarkdownEditor: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };

    const styles = `
        .container {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 100vh;
        }

        .editor {
            width: 50%;
            height: 100%;
            padding: 10px;
            font-size: 16px;
            border: none;
            outline: none;
            resize: none;
        }

        .preview {
            width: 50%;
            height: 100%;
            padding: 10px;
            background-color: #f5f5f5;
            overflow-y: auto;
        }

        h1, h2, h3, h4, h5, h6 {
            margin: 0;
            padding: 10px 0;
        }

        strong {
            font-weight: bold;
        }

        em {
            font-style: italic;
        }

        a {
            color: blue;
            text-decoration: none;
        }

        img {
            max-width: 100%;
        }

        pre {
            background-color: #333;
            color: #f5f5f5;
            padding: 10px;
            overflow-x: auto;
        }

        blockquote {
            border-left: 4px solid #ccc;
            padding-left: 10px;
            color: #555;
            margin: 0;
        }

        li {
            margin: 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            border: 1px solid #ccc;
            padding: 10px;
        }
    `;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh' }}>
            <textarea
                className="editor"
                value={markdown}
                onChange={handleChange}
                placeholder="Enter your markdown here..."
                style={{ width: '50%', height: '100%', padding: '10px', fontSize: '16px', border: 'none', outline: 'none', resize: 'none' }}
            />
            <MarkdownPreview markdown={markdown} />
            <style>{styles}</style>
        </div>
    );
};

export default MarkdownEditor;
