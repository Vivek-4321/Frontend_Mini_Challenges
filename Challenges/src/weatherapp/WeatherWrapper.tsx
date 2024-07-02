import React from 'react';
import WeatherApp from './WeatherApp';

const WeatherWrapper: React.FC = () => {
  return (
    <div className="weather-app-container">
      <WeatherApp />
    </div>
  );
};

export default WeatherWrapper;
