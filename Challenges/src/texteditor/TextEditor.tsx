import React, { useState, useRef, useEffect } from 'react';
import './TextEditor.css';

const Editor: React.FC = () => {
    const [content, setContent] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const formatText = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    const insertImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = `<img src="${e.target?.result as string}" style="max-width: 100%; display: block;" />`;
                formatText('insertHTML', img);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContentChange = () => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    };

    const setImageStyle = (style: string) => {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            const selectedNode = range.commonAncestorContainer as HTMLElement;
            if (selectedNode && selectedNode.tagName === 'IMG') {
                selectedNode.style.cssText = style;
            }
        }
    };

    return (
        <div>
            <div className="toolbar">
                <button onClick={() => formatText('bold')}>Bold</button>
                <button onClick={() => formatText('italic')}>Italic</button>
                <button onClick={() => formatText('underline')}>Underline</button>
                <button onClick={() => formatText('justifyLeft')}>Left</button>
                <button onClick={() => formatText('justifyCenter')}>Center</button>
                <button onClick={() => formatText('justifyRight')}>Right</button>
                <button onClick={insertImage}>Insert Image</button>
                <button onClick={() => setImageStyle('float: left; margin: 0 10px 10px 0;')}>Image Left</button>
                <button onClick={() => setImageStyle('display: block; margin: 0 auto;')}>Image Center</button>
                <button onClick={() => setImageStyle('float: right; margin: 0 0 10px 10px;')}>Image Right</button>
                <button onClick={() => formatText('insertHTML', '<pre><code></code></pre>')}>Code</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
            <div
                className="editor-content"
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
            <div className="output">
                <h3>Output HTML</h3>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
};

export default Editor;
