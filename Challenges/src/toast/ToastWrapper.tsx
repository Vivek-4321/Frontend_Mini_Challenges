import React, { useState } from 'react';
import Toast from './Toast';
import './ToastWrapper.css';

// const styles = {
//   toastWrapper: {
//     maxWidth: '600px',
//     margin: '0 auto',
//     padding: '20px',
//   },
//   h1: {
//     color: '#ffffff',
//     textAlign: 'center',
//     marginBottom: '30px',
//   },
//   controls: {
//     backgroundColor: '#2a2a2a',
//     borderRadius: '8px',
//     padding: '20px',
//     marginBottom: '20px',
//   },
//   controlGroup: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '5px',
//     color: '#b0b0b0',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     border: '1px solid #444',
//     borderRadius: '4px',
//     backgroundColor: '#333',
//     color: '#e0e0e0',
//   },
//   showToastBtn: {
//     display: 'block',
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#0078d4',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s',
//   },
// };

const ToastWrapper: React.FC = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({
      message: 'This is a sample toast message!',
      title: 'Toast Title',
      type: 'info' as 'success' | 'error' | 'info' | 'warning',
      duration: 3000,
      position: 'top-right' as 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
      theme: 'light' as 'light' | 'dark',
      animation: 'fade' as 'fade' | 'slide' | 'bounce',
    });
  
    const handleShowToast = () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), toastProps.duration);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setToastProps(prev => ({ ...prev, [name]: value }));
    };
  
  return (
    <div className="toast-wrapperr">
      <div className="toast-wrapperr-container">
           {/* <h1 className="toast-header">Toast Demo</h1> */}
      <div className="toast-controls">
        <div className="toast-column">
        <div className="toast-controls-group">
          <label className="toast-label">Message:</label>
          <input
            className="toast-input"
            type="text"
            name="message"
            value={toastProps.message}
            onChange={handleInputChange}
          />
        </div>
        <div className="toast-controls-group">
          <label className="toast-label">Animation:</label>
          <select 
            className="toast-select"
            name="animation" 
            value={toastProps.animation} 
            onChange={handleInputChange}
          >
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="bounce">Bounce</option>
          </select>
        </div>
        <div className="toast-controls-group">
          <label className="toast-label">Title:</label>
          <input
            className="toast-input"
            type="text"
            name="title"
            value={toastProps.title}
            onChange={handleInputChange}
          />
        </div>
        </div>
        <div className="toast-column">
        <div className="toast-controls-group">
          <label className="toast-label">Type:</label>
          <select 
            className="toast-select"
            name="type" 
            value={toastProps.type} 
            onChange={handleInputChange}
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div className="toast-controls-group">
          <label className="toast-label">Duration (ms):</label>
          <input
            className="toast-input"
            type="number"
            name="duration"
            value={toastProps.duration}
            onChange={handleInputChange}
          />
        </div>
        <div className="toast-controls-group">
          <label className="toast-label">Position:</label>
          <select 
            className="toast-select"
            name="position" 
            value={toastProps.position} 
            onChange={handleInputChange}
          >
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
          </select>
        </div>
        </div>
        {/* <div className="toast-controls-group">
          <label className="toast-label">Theme:</label>
          <select 
            className="toast-select"
            name="theme" 
            value={toastProps.theme} 
            onChange={handleInputChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div> */}
      </div>
      <button className="toast-button" onClick={handleShowToast}>Show Toast</button>
      {showToast && (
        <Toast
          {...toastProps}
          onClose={() => setShowToast(false)}
        />
      )}
      </div>
    </div>
  );
};

export default ToastWrapper;