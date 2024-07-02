import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

interface AnalogClockProps {
  size?: number;
  hourHandColor?: string;
  minuteHandColor?: string;
  secondHandColor?: string;
  hourMarkerColor?: string;
  showDigital?: boolean;
  initialDarkMode?: boolean;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  size = 400,
  hourHandColor = '#ff6b6b',
  minuteHandColor = '#4ecdc4',
  secondHandColor = '#45b7d1',
  hourMarkerColor = '#888888',
  showDigital = false,
  initialDarkMode = true,
}) => {
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [showDigitalTime, setShowDigitalTime] = useState(showDigital);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondsDegrees = (seconds / 60) * 360;
  const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hoursDegrees = ((hours + minutes / 60) / 12) * 360;

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleDigital = () => setShowDigitalTime(!showDigitalTime);

  return (
    <div className={`clock-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="clock-face">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="hour-marker"
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            <div className="marker-inner" />
          </div>
        ))}
        <div
          className="hand hour-hand"
          style={{ transform: `rotate(${hoursDegrees}deg)` }}
        />
        <div
          className="hand minute-hand"
          style={{ transform: `rotate(${minutesDegrees}deg)` }}
        />
        <div
          className="hand second-hand"
          style={{ transform: `rotate(${secondsDegrees}deg)` }}
        />
        <div className="clock-center" />
      </div>
      {showDigitalTime && (
        <div className="digital-time">
          {time.toLocaleTimeString()}
        </div>
      )}
      <div className="controls">
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={toggleDigital} className="digital-toggle">
          {showDigitalTime ? 'Hide' : 'Show'} Digital
        </button>
      </div>
      <style jsx>{`
        .clock-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-radius: 10px;
          transition: all 0.3s ease;
          width: 100%;
          height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .dark-mode {
          background-color: var(--color-primary);
          color: #ffffff;
        }
        .light-mode {
          background-color: #f0f0f0;
          color: #000000;
        }
        .clock-face {
          width: ${size}px;
          height: ${size}px;
          border: ${size / 30}px solid ${isDarkMode ? '#333' : '#ddd'};
          border-radius: 50%;
          position: relative;
          background: ${isDarkMode ? 'linear-gradient(145deg, #0d0e0d, #0f100f)' : '#ffffff'};
box-shadow:  20px 20px 60px #060606,
             -20px -20px 60px #161816;
        }
        .hour-marker {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
        .marker-inner {
          position: absolute;
          left: 50%;
          width: ${size / 100}px;
          height: ${size / 20}px;
          background: ${hourMarkerColor};
          transform: translateX(-50%);
        }
        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          transition: all 0.05s cubic-bezier(0.1, 2.7, 0.58, 1);
        }
        .hour-hand {
          width: ${size / 40}px;
          height: ${size * 0.25}px;
          background: ${hourHandColor};
          border-radius: ${size / 80}px;
        }
        .minute-hand {
          width: ${size / 60}px;
          height: ${size * 0.35}px;
          background: ${minuteHandColor};
          border-radius: ${size / 120}px;
        }
        .second-hand {
          width: ${size / 150}px;
          height: ${size * 0.4}px;
          background: ${secondHandColor};
        }
        .clock-center {
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size / 25}px;
          height: ${size / 25}px;
          border-radius: 50%;
          background: ${isDarkMode ? '#fff' : '#333'};
          transform: translate(-50%, -50%);
          z-index: 10;
        }
        .digital-time {
          margin-top: ${size / 15}px;
          font-size: ${size / 12}px;
          font-weight: bold;
        }
        .controls {
          margin-top: ${size / 15}px;
          display: flex;
          gap: 10px;
        }
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: ${isDarkMode ? '#333' : '#ddd'};
          color: ${isDarkMode ? '#fff' : '#333'};
        }
        button:hover {
          opacity: 0.8;
        }
        .theme-toggle {
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default AnalogClock;