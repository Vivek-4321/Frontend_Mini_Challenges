import React, { useState, useRef, useEffect } from 'react';
import './TextEditor.css';

const TextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>('');

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter the image URL');
    if (url) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'resizable draggable';
      imgContainer.style.position = 'relative';
      imgContainer.style.display = 'inline-block';

      const img = document.createElement('img');
      img.src = url;
      img.style.maxWidth = '200px';
      imgContainer.appendChild(img);

      editorRef.current?.appendChild(imgContainer);
      setResizeListeners(imgContainer);
      setDragListeners(imgContainer);
    }
  };

  const insertCode = () => {
    const code = prompt('Enter your code');
    if (code) {
      const pre = document.createElement('pre');
      pre.textContent = code;
      editorRef.current?.appendChild(pre);
    }
  };

  const setResizeListeners = (element: HTMLDivElement) => {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    positions.forEach(position => {
      const resizer = document.createElement('div');
      resizer.className = `resizer ${position}`;
      resizer.addEventListener('mousedown', (e) => initResize(e, element, position));
      element.appendChild(resizer);
    });
  };

  const initResize = (e: MouseEvent, element: HTMLDivElement, position: string) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.offsetWidth;
    const startHeight = element.offsetHeight;

    const doDrag = (e: MouseEvent) => {
      if (position.includes('right')) {
        element.style.width = startWidth + (e.clientX - startX) + 'px';
      }
      if (position.includes('left')) {
        element.style.width = startWidth - (e.clientX - startX) + 'px';
        element.style.left = startX + (e.clientX - startX) + 'px';
      }
      if (position.includes('bottom')) {
        element.style.height = startHeight + (e.clientY - startY) + 'px';
      }
      if (position.includes('top')) {
        element.style.height = startHeight - (e.clientY - startY) + 'px';
        element.style.top = startY + (e.clientY - startY) + 'px';
      }
    };

    const stopDrag = () => {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);
    };

    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
  };

  const setDragListeners = (element: HTMLDivElement) => {
    element.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).classList.contains('resizer')) return;
      e.preventDefault();
      const shiftX = e.clientX - element.getBoundingClientRect().left;
      const shiftY = e.clientY - element.getBoundingClientRect().top;

      const moveAt = (pageX: number, pageY: number) => {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
      };

      const onMouseMove = (e: MouseEvent) => {
        moveAt(e.pageX, e.pageY);
      };

      document.addEventListener('mousemove', onMouseMove);

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
    });

    element.ondragstart = () => false;
  };

  useEffect(() => {
    const images = editorRef.current?.getElementsByTagName('img');
    if (images) {
      Array.from(images).forEach(img => {
        const imgContainer = img.parentElement;
        if (imgContainer) {
          setResizeListeners(imgContainer as HTMLDivElement);
          setDragListeners(imgContainer as HTMLDivElement);
        }
      });
    }
  }, []);

  return (
    <div className="text-editor-container">
      <div className="toolbar">
        <button onClick={() => execCommand('bold')}>Bold</button>
        <button onClick={() => execCommand('italic')}>Italic</button>
        <button onClick={() => execCommand('underline')}>Underline</button>
        <button onClick={() => execCommand('insertUnorderedList')}>Bullet List</button>
        <button onClick={() => execCommand('formatBlock', 'h1')}>Heading</button>
        <button onClick={insertImage}>Image</button>
        <button onClick={insertCode}>Code</button>
      </div>
      <div
        className="editor"
        contentEditable
        ref={editorRef}
        onInput={handleContentChange}
      ></div>
      <div className="output">
        <h2>Output HTML:</h2>
        <pre>{content}</pre>
      </div>
    </div>
  );
};

export default TextEditor;
