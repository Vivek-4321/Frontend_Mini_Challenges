import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './AudioPlayer.css'

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      // Set up Web Audio API
      const setupAudioContext = () => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audio);
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      };

      // Setup audio context on user interaction to comply with autoplay policies
      const handleInteraction = () => {
        if (!audioContextRef.current) {
          setupAudioContext();
        }
        document.removeEventListener('click', handleInteraction);
      };
      document.addEventListener('click', handleInteraction);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        cancelAnimationFrame(animationRef.current);
        document.removeEventListener('click', handleInteraction);
      };
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        cancelAnimationFrame(animationRef.current);
      } else {
        audio.play().then(() => {
          animationRef.current = requestAnimationFrame(whilePlaying);
        }).catch(error => console.error("Playback failed", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const whilePlaying = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      drawWaveform();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (canvas && analyserRef.current && dataArrayRef.current) {
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / dataArrayRef.current.length) * 2.5;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * height;

        const r = 29 + (barHeight / height) * 200;
        const g = 185 + (barHeight / height) * 70;
        const b = 84;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} />
      <div className="audio-controls">
        <button onClick={togglePlayPause} className="audio-play-pause">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <canvas ref={canvasRef} width="240" height="60" className="audio-waveform" />
        <span className="audio-time">{formatTime(currentTime)}</span>
      </div>
      <div className="audio-time-display">
        <span>0:00</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;