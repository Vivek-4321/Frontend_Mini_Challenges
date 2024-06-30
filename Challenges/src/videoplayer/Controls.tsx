import React, { useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaCog,
  FaMagic,
} from "react-icons/fa";
import { BiCaptions } from "react-icons/bi";
import { MdSlowMotionVideo, MdSpeed } from "react-icons/md";

interface ControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  showSettings: boolean;
  currentQuality: string;
  qualityOptions: QualityOption[];
  userSelectedQuality: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFullscreen: () => void;
  onShowSettings: () => void;
  onQualityChange: (quality: string) => void;
  onResetQuality: () => void;
  onPlaybackSpeedChange: (speed: number) => void;
  isAmbientModeOn: boolean;
  onToggleAmbientMode: () => void;
  captions: Caption[];
  activeCaptions: Caption | null;
  onCaptionChange: (caption: Caption | null) => void;
}

interface QualityOption {
  url: string;
  label: string;
}

interface Caption {
  src: string;
  label: string;
  srclang: string;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  isMuted,
  isFullscreen,
  volume,
  currentTime,
  duration,
  showSettings,
  currentQuality,
  qualityOptions,
  userSelectedQuality,
  playbackSpeed,
  onPlayPause,
  onMute,
  onVolumeChange,
  onFullscreen,
  onShowSettings,
  onQualityChange,
  onResetQuality,
  onPlaybackSpeedChange,
  isAmbientModeOn,
  onToggleAmbientMode,
  captions,
  activeCaptions,
  onCaptionChange,
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const [showCaptionsMenu, setShowCaptionsMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const getSpeedIcon = (speed: number) => {
    if (speed < 1) return <MdSlowMotionVideo />;
    if (speed > 1) return <MdSpeed />;
    return <FaPlay />;
  };

  return (
    <>
      <div className="controls-content">
        <div className="left-controls">
          <button onClick={onPlayPause} className="control-button">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <div className="volume-control">
            <button onClick={onMute} className="control-button">
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={onVolumeChange}
              className="volume-slider"
            />
          </div>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="right-controls">
          <button onClick={() => setShowCaptionsMenu(!showCaptionsMenu)} className="control-button">
            <BiCaptions color={activeCaptions ? "#ffff00" : "#ffffff"} />
          </button>
          <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="control-button">
            {getSpeedIcon(playbackSpeed)}
          </button>
          <button onClick={onToggleAmbientMode} className="control-button">
            <FaMagic color={isAmbientModeOn ? "#ffff00" : "#ffffff"} />
          </button>
          <button onClick={onShowSettings} className="control-button">
            <FaCog />
          </button>
          <button onClick={onFullscreen} className="control-button">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
      <div className={`captions-menu ${showCaptionsMenu ? "show" : ""}`}>
        <h3>Captions</h3>
        <select
          onChange={(e) => onCaptionChange(captions.find(c => c.srclang === e.target.value) || null)}
          value={activeCaptions?.srclang || ""}
        >
          <option value="">Off</option>
          {captions.map((caption) => (
            <option key={caption.srclang} value={caption.srclang}>
              {caption.label}
            </option>
          ))}
        </select>
      </div>
      <div className={`speed-menu ${showSpeedMenu ? "show" : ""}`}>
        <h3>Playback Speed</h3>
        <div className="speed-options">
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => onPlaybackSpeedChange(speed)}
              className={`speed-button ${playbackSpeed === speed ? "active" : ""}`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
      <div className={`settings-menu ${showSettings ? "show" : ""}`}>
        <h3>Quality</h3>
        <select
          onChange={(e) => onQualityChange(e.target.value)}
          value={currentQuality}
        >
          <option value="auto">Auto</option>
          {qualityOptions.map((option) => (
            <option key={option.url} value={option.url}>
              {option.label}
            </option>
          ))}
        </select>
        {userSelectedQuality && (
          <button onClick={onResetQuality}>Reset to Auto</button>
        )}
      </div>
    </>
  );
};

export default Controls;