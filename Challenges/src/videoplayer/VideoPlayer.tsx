import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import "./VideoPlayer.css";
import { FaForward, FaBackward } from "react-icons/fa";
import Controls from "./Controls";
import SeekBar from "./SeekBar";
import AmbientBackground from "./AmbientBackground";
import Captions from "./Captions";
import SampleCaptions from './sample_captions.vtt';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  segments: Segment[];
  captions: Caption[];
  autoPlay?: boolean;
}

interface QualityOption {
  url: string;
  label: string;
}

interface Segment {
  name: string;
  time: number;
}

interface Caption {
  src: string;
  label: string;
  srclang: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, segments,  captions, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<string>(src);
  const [qualityOptions, setQualityOptions] = useState<QualityOption[]>([]);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSelectedQuality, setUserSelectedQuality] =
    useState<boolean>(false);
  const [isChangingQuality, setIsChangingQuality] = useState<boolean>(false);
  const [showForwardAnimation, setShowForwardAnimation] = useState(false);
  const [showBackwardAnimation, setShowBackwardAnimation] = useState(false);
  const [isAmbientModeOn, setIsAmbientModeOn] = useState(false);
  const [activeCaptions, setActiveCaptions] = useState<Caption | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const toggleAmbientMode = () => {
    setIsAmbientModeOn(!isAmbientModeOn);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    captions.forEach((caption) => {
      const track = document.createElement("track");
      track.kind = "captions";
      track.label = caption.label;
      track.srclang = caption.srclang;
      track.src = caption.src;
      video.appendChild(track);
    });

    const handleTrackChange = () => {
      const activeTracks = Array.from(video.textTracks).filter(
        (track) => track.mode === "showing"
      );
      setActiveCaptions(
        activeTracks.length > 0
          ? captions.find((caption) => caption.srclang === activeTracks[0].language) || null
          : null
      );
    };

    video.textTracks.addEventListener("change", handleTrackChange);

    return () => {
      video.textTracks.removeEventListener("change", handleTrackChange);
    };
  }, [captions]);

  const initHls = useCallback(() => {
    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        autoStartLoad: true,
        startLevel: -1, // Auto-select initial quality
        capLevelToPlayerSize: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60 MB
      });
      hlsRef.current.loadSource(src);
      hlsRef.current.attachMedia(videoRef.current!);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels;
        const newQualityOptions = levels.map((level, index) => ({
          url: level.url[0],
          label: `${level.height}p`,
        }));
        setQualityOptions(newQualityOptions);
        setCurrentQuality(newQualityOptions[0].url);
        setIsLoading(false);
      });

      hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        if (!userSelectedQuality) {
          const newQuality = hlsRef.current?.levels[data.level].url[0];
          setCurrentQuality(newQuality || "");
        }
      });

      // Error handling code remains the same
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      setIsLoading(false);
    }
  }, [src, userSelectedQuality]);

  useEffect(() => {
    initHls();
    return () => {
      hlsRef.current?.destroy();
    };
  }, [initHls]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key.toLowerCase()) {
        case "l":
          videoRef.current.currentTime = Math.min(
            videoRef.current.currentTime + 10,
            duration
          );
          setShowForwardAnimation(true);
          setTimeout(() => setShowForwardAnimation(false), 500);
          break;
        case "j":
          videoRef.current.currentTime = Math.max(
            videoRef.current.currentTime - 10,
            0
          );
          setShowBackwardAnimation(true);
          setTimeout(() => setShowBackwardAnimation(false), 500);
          break;
        case "k":
        case " ":
          e.preventDefault();
          togglePlay();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [duration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setBuffered(video.buffered);
      logBufferData();
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onProgress = logBufferData;

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("progress", onProgress);
    };
  }, []);

  const logBufferData = () => {
    const video = videoRef.current;
    if (!video || !video.buffered.length) return;

    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration;
    console.log(`Buffered: ${((bufferedEnd / duration) * 100).toFixed(2)}%`);
  };
  <div
    className="video-player"
    onMouseEnter={() => setShowControls(true)}
    onMouseLeave={() => setShowControls(false)}
    tabIndex={0} // Add this line
  ></div>;
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .catch((error) => console.error("Error playing video:", error));
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleQualityChange = (url: string) => {
    if (url === "auto") {
      resetToAutomaticQuality();
      return;
    }

    setCurrentQuality(url);
    setUserSelectedQuality(true);
    setIsChangingQuality(true);
    setIsLoading(true);

    if (hlsRef.current && videoRef.current) {
      const levelIndex = hlsRef.current.levels.findIndex(
        (level) => level.url[0] === url
      );
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;

      hlsRef.current.currentLevel = levelIndex;

      // Wait for the new quality to load
      hlsRef.current.once(Hls.Events.LEVEL_LOADED, () => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying) {
            videoRef.current
              .play()
              .catch((error) => console.error("Error playing video:", error));
          }
          setIsChangingQuality(false);
          setIsLoading(false);
        }
      });

      // Fallback timeout
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
  
          if (wasPlaying && videoRef.current.paused) {
            videoRef.current
              .play()
              .catch((error) => console.error("Error playing video:", error));
          }
          setIsChangingQuality(false);
          setIsLoading(false);
        }
      }, 2000);
    }
  };

  const resetToAutomaticQuality = () => {
    setUserSelectedQuality(false);
    setCurrentQuality("auto");
    setIsChangingQuality(true);
    setIsLoading(true);

    if (hlsRef.current && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;

      hlsRef.current.currentLevel = -1;
      hlsRef.current.loadLevel = -1;

      // Wait for the auto level selection to take effect
      hlsRef.current.once(Hls.Events.LEVEL_LOADED, () => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying) {
            videoRef.current
              .play()
              .catch((error) => console.error("Error playing video:", error));
          }
          setIsChangingQuality(false);
          setIsLoading(false);
        }
      });

      // Fallback timeout
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying && videoRef.current.paused) {
            videoRef.current
              .play()
              .catch((error) => console.error("Error playing video:", error));
          }
          setIsChangingQuality(false);
          setIsLoading(false);
        }
      }, 2000);
    }
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const eventMarkers = [
    { time: 30, icon: 'https://img.freepik.com/free-psd/realistic-lottery-symbol-isolated_23-2151177245.jpg?t=st=1719709767~exp=1719713367~hmac=b8eddd243c1f7d9ee5f619ae5f093fa38fa53925d07933f54d70dd5c5d4de963&w=740', tooltip: 'Toss' },
    { time: 120, icon: 'https://img.freepik.com/free-vector/soccer-ball-realistic-white-black-picture_1284-8506.jpg?w=740&t=st=1719709721~exp=1719710321~hmac=8d1b0a991d40abbf50f45272554f9c39f626c69c5ee20bcd39d3945324f799f5', tooltip: 'Goal' },
    // Add more markers as needed
  ];

  return (
    <div
      className={`video-player ${isAmbientModeOn ? 'ambient-mode' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <AmbientBackground videoRef={videoRef} isAmbientModeOn={isAmbientModeOn} />
      <video
      ref={videoRef}
      poster={poster}
      className="video-element"
      onClick={togglePlay}
    > <track kind="captions" src="./sample_captions.vtt" srclang="en" label="English"/></video>
    <Captions videoRef={videoRef} activeCaptions={activeCaptions} />
    {isLoading && (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )}
    <div className={`controls ${showControls ? "show" : ""}`}>
    <SeekBar
  currentTime={currentTime}
  duration={duration}
  buffered={buffered}
  onSeek={handleSeek}
  segments={segments}
  eventMarkers={eventMarkers}
/>
      <Controls
          isPlaying={isPlaying}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          showSettings={showSettings}
          currentQuality={currentQuality}
          qualityOptions={qualityOptions}
          userSelectedQuality={userSelectedQuality}
          isAmbientModeOn={isAmbientModeOn}
          onPlayPause={togglePlay}
          onMute={toggleMute}
          onVolumeChange={handleVolumeChange}
          onFullscreen={toggleFullscreen}
          onShowSettings={() => setShowSettings(!showSettings)}
          onQualityChange={handleQualityChange}
          onResetQuality={resetToAutomaticQuality}
          onToggleAmbientMode={toggleAmbientMode}
          captions={captions}
          activeCaptions={activeCaptions}
          onCaptionChange={setActiveCaptions}
          playbackSpeed={playbackSpeed}
  onPlaybackSpeedChange={handlePlaybackSpeedChange}
        />
    </div>
    {showForwardAnimation && (
      <div className="seek-animation forward">
        <FaForward />
      </div>
    )}
    {showBackwardAnimation && (
      <div className="seek-animation backward">
        <FaBackward />
      </div>
    )}
  </div>
  );
};

export default VideoPlayer;
