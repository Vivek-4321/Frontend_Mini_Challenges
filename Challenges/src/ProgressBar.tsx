import { useState, useEffect, useRef } from 'react';
import './ProgressBar.css';

function ProgressBar() {
  const [value, setValue] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setValue((val) => val + 1);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (value === 100 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [value]);

  return (
    <div className='progress-bar__warpper'>
      <div className='progress-bar__container'>
        <div className='progress-bar__bar' style={{ width: `${value}%` }}>
          <span  style={{
          color: value > 49 ? "white" : "black"
        }} >{value.toFixed()}%</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;



