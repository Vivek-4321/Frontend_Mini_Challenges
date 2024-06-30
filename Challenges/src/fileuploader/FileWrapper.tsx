import React from 'react';
import FileUploader from './FileUploader';

const FileWrapper: React.FC = () => {

  return (
    <div className="file-app">
      <h1>File Uploader</h1>
      <FileUploader/>
    </div>
  );
};

export default FileWrapper;