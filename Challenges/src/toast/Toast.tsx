// Toast.js
import React, { useState, useEffect } from 'react';
import './Toast.css';
import { HiMiniRectangleGroup } from "react-icons/hi2";

const Toast = ({
  title,
  message,
  type,
  onClose,
  position,
  theme,
  animation,
  duration,
  index
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'error': return '✕';
      case 'warning': return '!';
      case 'info': return '?';
      case 'success': return '✓';
      default: return '';
    }
  };

  const getPositionStyle = () => {
    const basePosition = {
      top: `${35 + index * 110}px`,
      right: '20px'
    };
    
    switch (position) {
      case 'top-left':
        return { ...basePosition, right: 'auto', left: '20px' };
      case 'bottom-right':
        return { ...basePosition, top: 'auto', bottom: `${20 + index * 70}px` };
      case 'bottom-left':
        return { ...basePosition, top: 'auto', bottom: `${20 + index * 70}px`, right: 'auto', left: '20px' };
      case 'top-right':
      default:
        return basePosition;
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  return (
     <div
      className={`toast-container ${type} ${theme} ${animation} ${isClosing ? 'closing' : ''}`}
      style={{
        ...getPositionStyle(),
      }}
      data-position={position} // Add data-position attribute
    >
      <div className="icon-container">
        <div className="icon-background">
          <div className="icon-content">{getIcon()}</div>
        </div>
      </div>
      
      <div className={`toast toast-${type}`}>
        <div className="toast-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className='toast-left-icon'><HiMiniRectangleGroup /></div>
        <div className="toast-background-icon">
          <div className='toast-background-icon-item'>{getIcon()}</div>
        </div>
        <button className="toast-close" onClick={handleClose}>✕</button>
      </div>
    </div>
  );
};

export default Toast;
