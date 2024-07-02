import React, { useState, useEffect } from 'react';
import { FaCheck, FaRedo } from 'react-icons/fa';

interface ProgressBarProps {
  progress: number;
  onRestart: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, onRestart }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(progress);
  }, [progress]);

  return (
    <div className="progress-container">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${width}%` }}>
          <div className="progress-glow"></div>
        </div>
      </div>
      <div className="progress-info">
        <span className="progress-text">{`${Math.round(width)}%`}</span>
        {width === 100 ? (
          <div className="check-icon">
            <FaCheck />
          </div>
        ) : (
          <button className="restart-button" onClick={onRestart}>
            <FaRedo />
          </button>
        )}
      </div>
      {width === 100 && (
        <div className="restart-icon-below" onClick={onRestart}>
          <FaRedo />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 0.5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [key]);

  const handleRestart = () => {
    setProgress(0);
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="progressbar-app">
      <h1>Enhanced Dynamic Progress Bar</h1>
      <ProgressBar progress={progress} onRestart={handleRestart} />
      <style jsx>{`
        .progressbar-app {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 90vh;
          width: 100%;
          background-color: var(--color-primary);
        }

        .progress-container {
          margin-top: -3rem;
          width: 300px;
        }

        .progress-bar-container {
          height: 30px;
          background-color: var(--color-primary);
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #45a049);
          transition: width 0.3s ease-out;
          position: relative;
          overflow: hidden;
        }

        .progress-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: glow 2s infinite;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .progress-text {
          color: var(--color-light);
          font-weight: bold;
          font-size: 18px;
        }

        .restart-icon-below {
          color: var(--color-text);
          margin-left: 9rem;
        }

        .restart-icon-below:active {
          transform: rotate(10deg);
        }

        .check-icon, .restart-button {
          color: #4caf50;
          font-size: 18px;
        }

        .check-icon {
          animation: bounce 0.5s ease-in-out;
        }

        .restart-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.3s ease;
        }

        .restart-button:hover {
          transform: rotate(180deg);
        }

        @keyframes glow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}