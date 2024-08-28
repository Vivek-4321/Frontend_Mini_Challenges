// import React, { useState, useRef, useEffect } from 'react';
// import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaImage, FaListUl, FaCode, FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa';
// import './TextEditor.css';

// const TextEditor: React.FC = () => {
//   const [content, setContent] = useState('');
//   const editorRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const execCommand = (command: string, value: string = '') => {
//     document.execCommand(command, false, value);
//     editorRef.current?.focus();
//   };

//   const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     execCommand('foreColor', e.target.value);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const img = document.createElement('img');
//         img.src = event.target?.result as string;
//         img.style.maxWidth = '100%';
//         img.style.height = 'auto';
//         img.style.display = 'inline-block';
//         img.style.margin = '0 10px 10px 0';
//         img.style.float = 'left'; // Default float
//         img.setAttribute('contenteditable', 'false');
        
//         if (editorRef.current) {
//           const selection = window.getSelection();
//           if (selection && selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             range.insertNode(img);
//             range.setStartAfter(img);
//             range.setEndAfter(img);
//             selection.removeAllRanges();
//             selection.addRange(range);
//           } else {
//             editorRef.current.appendChild(img);
//           }
          
//           editorRef.current.focus();
//           setContent(editorRef.current.innerHTML);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageAlign = (align: 'left' | 'center' | 'right') => {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const img = range.commonAncestorContainer.parentElement?.querySelector('img');
//       if (img) {
//         img.style.float = align === 'center' ? 'none' : align;
//         img.style.display = align === 'center' ? 'block' : 'inline-block';
//         img.style.margin = align === 'center' ? '0 auto 10px' : align === 'left' ? '0 10px 10px 0' : '0 0 10px 10px';
//         setContent(editorRef.current?.innerHTML || '');
//       }
//     }
//   };

//   const handleImageResize = (increase: boolean) => {
//     const selection = window.getSelection();
//     if (selection && selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const img = range.commonAncestorContainer.parentElement?.querySelector('img');
//       if (img) {
//         const currentWidth = img.width;
//         const newWidth = increase ? currentWidth * 1.1 : currentWidth * 0.9;
//         img.style.width = `${newWidth}px`;
//         setContent(editorRef.current?.innerHTML || '');
//       }
//     }
//   };

//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.focus();
//     }
//   }, []);

//   const handleEditorChange = () => {
//     if (editorRef.current) {
//       setContent(editorRef.current.innerHTML);
//     }
//   };

//   const handleImageButtonClick = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="text-editor">
//       <div className="toolbar">
//         <button onClick={() => execCommand('bold')}><FaBold /></button>
//         <button onClick={() => execCommand('italic')}><FaItalic /></button>
//         <button onClick={() => execCommand('underline')}><FaUnderline /></button>
//         <input type="color" onChange={handleColorChange} />
//         <button onClick={() => execCommand('justifyLeft')}><FaAlignLeft /></button>
//         <button onClick={() => execCommand('justifyCenter')}><FaAlignCenter /></button>
//         <button onClick={() => execCommand('justifyRight')}><FaAlignRight /></button>
//         <button onClick={handleImageButtonClick}><FaImage /></button>
//         <input 
//           ref={fileInputRef}
//           type="file" 
//           accept="image/*" 
//           onChange={handleImageUpload} 
//           style={{display: 'none'}} 
//         />
//         <button onClick={() => handleImageAlign('left')}><FaAlignLeft /> Image</button>
//         <button onClick={() => handleImageAlign('center')}><FaAlignCenter /> Image</button>
//         <button onClick={() => handleImageAlign('right')}><FaAlignRight /> Image</button>
//         <button onClick={() => handleImageResize(true)}><FaExpandArrowsAlt /></button>
//         <button onClick={() => handleImageResize(false)}><FaCompressArrowsAlt /></button>
//         <button onClick={() => execCommand('insertUnorderedList')}><FaListUl /></button>
//         <button onClick={() => execCommand('insertHTML', '<pre><code></code></pre>')}><FaCode /></button>
//       </div>
//       <div
//         ref={editorRef}
//         className="editor-content"
//         contentEditable
//         onInput={handleEditorChange}
//         dangerouslySetInnerHTML={{ __html: content }}
//       ></div>
//       <div className="preview">
//         <h3>Preview:</h3>
//         <div dangerouslySetInnerHTML={{ __html: content }}></div>
//       </div>
//     </div>
//   );
// };

// export default TextEditor;

import React, { useState, useRef, useEffect } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaImage,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import './TextEditor.css';

const TextEditor: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    setContent(editorRef.current?.innerHTML || '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => adjustImageSize(img));
        insertNodeAtCursor(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const adjustImageSize = (img: HTMLImageElement, increment: number = 0) => {
    const currentWidth = parseInt(img.style.width || '100', 10);
    const newWidth = currentWidth + increment;
    if (newWidth > 0) {
      img.style.width = `${newWidth}px`;
      img.style.height = 'auto';
      img.focus();
      setContent(editorRef.current?.innerHTML || '');
    }
  };

  const insertNodeAtCursor = (node: Node) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(node);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      setContent(editorRef.current?.innerHTML || '');
    }
  };

  const handleInput = () => {
    setContent(editorRef.current?.innerHTML || '');
  };

  const handleImageFloat = (float: 'left' | 'right' | 'none') => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const img = range.startContainer.parentElement;
      if (img && img.tagName === 'IMG') {
        img.style.float = float;
        img.style.margin = '0 10px'; // add some margin around the image
        setContent(editorRef.current?.innerHTML || '');
      }
    }
  };

  const getSelectedImage = (): HTMLImageElement | null => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const img = range.startContainer.parentElement;
      if (img && img.tagName === 'IMG') {
        return img as HTMLImageElement;
      }
    }
    return null;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  return (
    <div className="text-editor-container">
      <div className="text-editor">
        <div className="toolbar">
          <button onClick={() => execCommand('bold')}><FaBold /></button>
          <button onClick={() => execCommand('italic')}><FaItalic /></button>
          <button onClick={() => execCommand('underline')}><FaUnderline /></button>
          <button onClick={() => execCommand('justifyLeft')}><FaAlignLeft /></button>
          <button onClick={() => execCommand('justifyCenter')}><FaAlignCenter /></button>
          <button onClick={() => execCommand('justifyRight')}><FaAlignRight /></button>
          <label className="image-upload">
            <FaImage />
            <input type="file" accept="image/*" onChange={handleImageUpload} multiple />
          </label>
          <button onClick={() => handleImageFloat('left')}>Float Left</button>
          <button onClick={() => handleImageFloat('right')}>Float Right</button>
          <button onClick={() => handleImageFloat('none')}>Clear Float</button>
          <button onClick={() => {
            const img = getSelectedImage();
            if (img) adjustImageSize(img, 10);
          }}><FaPlus /></button>
          <button onClick={() => {
            const img = getSelectedImage();
            if (img) adjustImageSize(img, -10);
          }}><FaMinus /></button>
        </div>
        <div
          className="editor-content"
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div className="preview-container">
        <h3>Live Preview:</h3>
        <div className="preview-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className="html-output">
        <h3>HTML Output:</h3>
        <pre>{content}</pre>
      </div>
    </div>
  );
};

export default TextEditor;
