import React from 'react';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, onZoomChange }) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.1, 0.1));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      background: '#2D2D2D',
      padding: '5px',
      borderRadius: '20px',
    }}>
      <button onClick={handleZoomOut} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
        <FiZoomOut color="white" size={20} />
      </button>
      <span style={{ color: 'white', margin: '0 10px' }}>{Math.round(zoom * 100)}%</span>
      <button onClick={handleZoomIn} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
        <FiZoomIn color="white" size={20} />
      </button>
    </div>
  );
};

export default ZoomControls;