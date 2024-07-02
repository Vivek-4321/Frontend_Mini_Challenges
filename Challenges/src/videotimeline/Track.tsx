import React from 'react';
import Clip from './Clip';

interface TrackProps {
  name: string;
  thumbnails?: string[];
}

const Track: React.FC<TrackProps> = ({ name, thumbnails }) => {
  return (
    <div className="track">
      <div className="track-name">{name}</div>
      <div className="track-content">
        {thumbnails && <Clip thumbnails={thumbnails} />}
      </div>
    </div>
  );
};

export default Track;

