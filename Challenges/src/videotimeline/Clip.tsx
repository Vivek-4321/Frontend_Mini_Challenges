import React from 'react';

interface ClipProps {
  thumbnails: string[];
}

const Clip: React.FC<ClipProps> = ({ thumbnails }) => {
  return (
    <div className="clip">
      {thumbnails.map((thumb, index) => (
        <img key={index} src={thumb} alt={`Thumbnail ${index}`} />
      ))}
    </div>
  );
};

export default Clip;