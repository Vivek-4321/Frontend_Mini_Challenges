import React, { useRef, useState } from 'react';

interface Segment {
  name: string;
  time: number;
}

interface EventMarker {
  time: number;
  icon: string;
  tooltip: string;
}

interface SeekBarProps {
  currentTime: number;
  duration: number;
  buffered: TimeRanges | null;
  onSeek: (time: number) => void;
  segments: Segment[];
  eventMarkers: EventMarker[];
}

const SeekBar: React.FC<SeekBarProps> = ({ 
  currentTime, 
  duration, 
  buffered, 
  onSeek, 
  segments,
  eventMarkers 
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<{ name: string, time: number } | null>(null);

  const getBufferedWidth = () => {
    if (!buffered || buffered.length === 0) return "0%";
    const bufferedEnd = buffered.end(buffered.length - 1);
    return `${(bufferedEnd / duration) * 100}%`;
  };

  const handleSeekBarMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    onSeek(pos * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * duration;

    const segment = segments.find((seg, index) => {
      const nextSegment = segments[index + 1];
      return time >= seg.time && (!nextSegment || time < nextSegment.time);
    });

    const marker = eventMarkers.find(marker => 
      Math.abs(marker.time - time) < 0.5 // Consider markers within 0.5 seconds
    );

    setHoveredItem(marker ? { name: marker.tooltip, time: marker.time } : 
                   segment ? { name: segment.name, time: segment.time } : null);
  };

  return (
    <div
      ref={progressRef}
      className="seek-bar"
      onMouseDown={handleSeekBarMove}
      onMouseMove={(e) => {
        handleMouseMove(e);
        if (e.buttons === 1) handleSeekBarMove(e);
      }}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="buffered" style={{ width: getBufferedWidth() }} />
      <div
        className="progress"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      />
      {segments.map((segment, index) => (
        <div
          key={`segment-${index}`}
          className="segment-marker"
          style={{ left: `${(segment.time / duration) * 100}%` }}
        />
      ))}
      {eventMarkers.map((marker, index) => (
        <div
          key={`marker-${index}`}
          className="event-marker"
          style={{ left: `${(marker.time / duration) * 100}%` }}
        >
          <img src={marker.icon} alt={marker.tooltip} />
        </div>
      ))}
      <div
        ref={thumbRef}
        className="seek-thumb"
        style={{ left: `${(currentTime / duration) * 100}%` }}
      />
      {hoveredItem && (
        <div
          className="tooltip"
          style={{ left: `${(hoveredItem.time / duration) * 100}%` }}
        >
          {hoveredItem.name}
        </div>
      )}
    </div>
  );
};

export default SeekBar;