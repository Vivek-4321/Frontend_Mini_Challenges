import React, { useState } from 'react';
import TextEditor from './TextEditor';
import './TextEditor.css'

const TextEditorWrapper: React.FC = () => {
  const [editorContent, setEditorContent] = useState('');

  const handleSave = () => {
    // Here you would typically send the content to a server or perform other actions
    console.log('Editor content:', editorContent);
    alert('Content saved!');
  };

  return (
    <div className="text-editor-wrapper">
      <h1 className="wrapper-title">My Rich Text Editor</h1>
      <TextEditor />
      <div className="wrapper-controls">
        <button className="wrapper-button" onClick={handleSave}>Save Content</button>
      </div>
    </div>
  );
};

export default TextEditorWrapper;