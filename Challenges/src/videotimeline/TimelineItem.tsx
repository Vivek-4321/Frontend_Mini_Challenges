import React, { useState, useRef, useEffect } from 'react';

interface TimelineItemProps {
  item: { id: number, start: number, top: number, width: number, videoFile: File };
  updateItem: (id: number, start: number, top: number, width: number) => void;
  ffmpeg: any;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, updateItem, ffmpeg }) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const timelineItemRef = useRef<HTMLDivElement>(null);
  const initialMouseX = useRef(0);
  const initialMouseY = useRef(0);
  const initialStart = useRef(0);
  const initialTop = useRef(0);
  const initialWidth = useRef(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    if (ffmpeg) {
      generateThumbnails(item.videoFile);
    }
  }, [item.videoFile, ffmpeg]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    initialMouseX.current = e.clientX;
    initialMouseY.current = e.clientY;
    initialStart.current = item.start;
    initialTop.current = item.top;
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    initialMouseX.current = e.clientX;
    initialWidth.current = item.width;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - initialMouseX.current;
      const deltaY = e.clientY - initialMouseY.current;
      updateItem(item.id, initialStart.current + deltaX, initialTop.current + deltaY, item.width);
    } else if (resizing) {
      const deltaX = e.clientX - initialMouseX.current;
      updateItem(item.id, item.start, item.top, initialWidth.current + deltaX);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing]);

  const generateThumbnails = async (file: File) => {
    if (!ffmpeg || !ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(file));

    const duration = 5; // Assume a 5-second video for simplicity
    for (let i = 0; i < 5; i++) {
      const seekTime = i * duration;
      await ffmpeg.run('-i', 'video.mp4', '-ss', seekTime.toString(), '-frames:v', '1', `output${i}.png`);
      const data = ffmpeg.FS('readFile', `output${i}.png`);
      const thumbnailURL = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));
      setThumbnails(prevThumbnails => [...prevThumbnails, thumbnailURL]);
    }
  };

  return (
    <div
      ref={timelineItemRef}
      className="timeline-item"
      style={{ left: item.start, top: item.top, width: item.width }}
      onMouseDown={handleMouseDown}
    >
      <div className="thumbnails">
        {thumbnails.map((thumbnail, index) => (
          <img key={index} src={thumbnail} alt={`thumbnail-${index}`} className="thumbnail" />
        ))}
      </div>
      <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
    </div>
  );
};

export default TimelineItem;
