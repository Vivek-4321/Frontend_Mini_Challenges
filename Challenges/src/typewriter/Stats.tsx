import React, { useState, useEffect } from 'react';
import { FaKeyboard, FaBullseye } from 'react-icons/fa';

interface StatsProps {
  wpm: number;
  accuracy: number;
}

const Stats: React.FC<StatsProps> = ({ wpm, accuracy }) => {
  const [animatedWpm, setAnimatedWpm] = useState(0);
  const [animatedAccuracy, setAnimatedAccuracy] = useState(0);

  useEffect(() => {
    const wpmInterval = setInterval(() => {
      setAnimatedWpm(prev => {
        if (prev < wpm) return prev + 1;
        clearInterval(wpmInterval);
        return wpm;
      });
    }, 20);

    const accuracyInterval = setInterval(() => {
      setAnimatedAccuracy(prev => {
        if (prev < accuracy) return prev + 1;
        clearInterval(accuracyInterval);
        return accuracy;
      });
    }, 20);

    return () => {
      clearInterval(wpmInterval);
      clearInterval(accuracyInterval);
    };
  }, [wpm, accuracy]);

  const wpmPercentage = (animatedWpm / 200) * 100; // Assuming max WPM is 200
  const wpmAngle = (wpmPercentage / 100) * 180 - 90; // -90 to 90 degrees
  const accuracyAngle = (animatedAccuracy / 100) * 180 - 90;
  const accuracyPercentage = (animatedAccuracy / 100) * 100;

  return (
    <div className="stats-overlay" >
      <div className="stats-container">
        <div className="stat-item wpm-stat">
          {/* <FaKeyboard size={24} /> */}
          <div className="speedometer">
            <svg viewBox="0 0 200 100">
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#4D4D4C"
                strokeWidth="20"
              />
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#E7E6E6"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (wpmPercentage / 100) * 251.2}
                className="speedometer-progress"
              />
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="40"
                stroke="#E7E6E6"
                strokeWidth="2"
                transform={`rotate(${wpmAngle}, 100, 100)`}
                className="speedometer-needle"
              />
              <circle cx="100" cy="100" r="5" fill="#333" />
            </svg>
            {/* <div className="speedometer-value">{animatedWpm}</div> */}
          </div>
          <div className="stat-label">{animatedWpm} WPM</div>
        </div>
        <div className="stat-item accuracy-stat">
          {/* <FaBullseye size={24} /> */}
          <div className="accuracy-circle">
          <svg viewBox="0 0 200 100">
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#4D4D4C"
                strokeWidth="20"
              />
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#E7E6E6"
                strokeWidth="20"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (accuracyPercentage / 100) * 251.2}
                className="speedometer-progress"
              />
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="40"
                stroke="#E7E6E6"
                strokeWidth="2"
                transform={`rotate(${accuracyAngle}, 100, 100)`}
                className="speedometer-needle"
              />
              <circle cx="100" cy="100" r="5" fill="#333" />
            </svg>
            {/* <div className="accuracy-value">{animatedAccuracy}%</div> */}
          </div>
          <div className="stat-label">{animatedAccuracy}%</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;