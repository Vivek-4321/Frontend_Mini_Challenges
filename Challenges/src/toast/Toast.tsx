import React, { useState, useEffect } from 'react';
import './Toast.css';
import { HiMiniRectangleGroup } from "react-icons/hi2";

interface ToastProps {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  onClose: () => void;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  theme: 'light' | 'dark';
  animation: 'fade' | 'slide' | 'bounce';
  duration: number;
}

const Toast: React.FC<ToastProps> = ({ 
  title, 
  message, 
  type, 
  onClose, 
  position, 
  theme, 
  animation,
  duration
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'error': return '✕';
      case 'warning': return '!';
      case 'info': return '?';
      case 'success': return '✓';
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'top-right': return { top: '35px', right: '20px' };
      case 'top-left': return { top: '35px', left: '20px' };
      case 'bottom-right': return { bottom: '20px', right: '20px' };
      case 'bottom-left': return { bottom: '20px', left: '20px' };
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation to finish before calling onClose
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
      style={getPositionStyle()}
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