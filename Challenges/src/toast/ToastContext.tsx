// ToastProvider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Toast from './Toast';

interface ToastContextType {
  success: (title: string, message: string, options?: object) => void;
  error: (title: string, message: string, options?: object) => void;
  info: (title: string, message: string, options?: object) => void;
  warning: (title: string, message: string, options?: object) => void;
  log: (title: string, message: string, options?: object) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastCount = 0;

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Array<any>>([]);

  const createToast = useCallback((type: string, title: string, message: string, options: object = {}) => {
    const id = `toast-${toastCount++}`;
    const newToast = {
      id,
      type,
      title,
      message,
      ...options
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    if (options.duration !== Infinity) {
      setTimeout(() => removeToast(id), options.duration || 3000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (title: string, message: string, options?: object) => createToast('success', title, message, options),
    error: (title: string, message: string, options?: object) => createToast('error', title, message, options),
    info: (title: string, message: string, options?: object) => createToast('info', title, message, options),
    warning: (title: string, message: string, options?: object) => createToast('warning', title, message, options),
    log: (title: string, message: string, options?: object) => createToast('log', title, message, options),
  };

  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={toast}>
    {children}
    <div className="toast-container-wrapper">
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className="toast-position-container" data-position={position}>
          {positionToasts.map((toast, index) => (
            <Toast
              key={toast.id}
              index={index}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
              theme={toast.theme || 'light'}
              duration={toast.duration}
              animation={toast.animation || 'slide'}
              position={position}
            />
          ))}
        </div>
      ))}
    </div>
  </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Add a default export
const ToastModule = {
  ToastProvider,
  useToast
};

export default ToastModule;