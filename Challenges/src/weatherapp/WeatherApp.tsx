import React, { useState, useEffect } from 'react';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaWind, FaSearch } from 'react-icons/fa';
import './WeatherApp.css'; // Normal CSS for styling

interface WeatherData {
  condition: string;
  description: string;
  temp: number;
  city: string;
  country: string;
}

const WeatherApp: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>('New York');
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setIsLoading(true);
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoResponse.json();
    if (geoData.results && geoData.results.length > 0) {
      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherResponse.json();
      setWeather({
        condition: weatherData.current_weather.weathercode,
        description: getWeatherDescription(weatherData.current_weather.weathercode),
        temp: weatherData.current_weather.temperature,
        city: name,
        country: country,
      });
    }
    setIsLoading(false);
  };

  const getWeatherDescription = (weathercode: number) => {
    const weatherDescriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherDescriptions[weathercode] || 'Unknown weather';
  };

  const getWeatherIcon = (weathercode: number) => {
    switch (weathercode) {
      case 0:
        return <FaSun />;
      case 1:
      case 2:
      case 3:
        return <FaCloud />;
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return <FaCloudRain />;
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return <FaSnowflake />;
      case 95:
      case 96:
      case 99:
        return <FaWind />;
      default:
        return <FaSun />;
    }
  };

  const getWeatherAnimation = (weathercode: number) => {
    switch (true) {
      case [0, 1].includes(weathercode):
        return 'sunny-animation';
      case [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weathercode):
        return 'rainy-animation';
      case [95, 96, 99].includes(weathercode):
        return 'lightning-animation';
      default:
        return '';
    }
  };


  return (
    <div className={`weather-app ${weather ? getWeatherAnimation(weather.condition) : ''}`}>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
        />
        <FaSearch className="search-icon" onClick={fetchWeather} />
      </div>
      {isLoading ? (
        <div className="loader"></div>
      ) : weather ? (
        <div className="weather-info">
          <div className="weather-icon">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="weather-details">
            <h2>{weather.city}, {weather.country}</h2>
            <p className="temperature">{weather.temp}°C</p>
            <p className="description">{weather.description}</p>
          </div>
        </div>
      ) : (
        <div className="no-data">No weather data available</div>
      )}
      <div className="animation-container">
        <div className="sun"></div>
        <div className="cloud"></div>
        <div className="rain"></div>
        <div className="lightning"></div>
      </div>
    </div>
  );
};

export default WeatherApp;
