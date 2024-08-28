import React, { useState } from 'react';
import TextEditor from './TextEditor';
import './TextEditor.css'
import { useToast } from '../toast/ToastContext.tsx'

const TextEditorWrapper: React.FC = () => {
  const [editorContent, setEditorContent] = useState('');
  const toast = useToast();

  const handleSave = () => {
    // Here you would typically send the content to a server or perform other actions
    console.log('Editor content:', editorContent);

    //toast.success('Success', 'Operation completed successfully', { duration: 3000, position: "top-left" });
    toast.error('Error', 'Something went wrong', { duration: 5000, position: "top-left" });
  };

  return (
    <div className="text-editor-wrapper">
      <h1 className="wrapper-title">My Rich Text Editor</h1>
      ?
      <div className="wrapper-controls">
        <button className="wrapper-button" onClick={handleSave}>Save Content</button>
      </div>
    </div>
  );
};

export default TextEditorWrapper;