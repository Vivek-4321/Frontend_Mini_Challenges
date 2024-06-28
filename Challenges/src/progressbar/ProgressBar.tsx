import React, { useState, useEffect } from 'react';
import { FaCheck, FaRedo } from 'react-icons/fa';
import './ProgressBar.css'

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
    </div>
  );
}