import React, { useRef, useState } from 'react';
import { FaFileImage, FaFileVideo, FaTrash } from 'react-icons/fa';
import './FileUploader.css'; // Normal CSS for styling

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFilesAdded = (event: React.ChangeEvent<HTMLInputElement>) => {
    const addedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles((prevFiles) => [...prevFiles, ...addedFiles]);
  };

  const handleDelete = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  return (
    <div
      className="file-uploader"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFilesAdded}
      />
      <div className="drop-zone">
        {files.length === 0 ? (
          <>
            <FaFileImage className="upload-icon" />
            <span>Drag & Drop files here, or click to select files</span>
          </>
        ) : (
          <div className="file-preview">
            {files.map((file, index) => (
              <div className="file-item" key={index}>
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-image"
                  />
                ) : file.type.startsWith('video/') ? (
                  <video controls className="preview-video">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                ) : (
                  <div className="file-icon">
                    {file.type.startsWith('image/') ? <FaFileImage /> : <FaFileVideo />}
                  </div>
                )}
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
                </div>
                <button className="delete-button" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(index);
                }}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
