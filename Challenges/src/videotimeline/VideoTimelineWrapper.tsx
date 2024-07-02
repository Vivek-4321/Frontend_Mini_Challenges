import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import TimelineItem from './TimelineItem';
import './VideoTimelineWrapper.css';

const Timeline: React.FC = () => {
  const [items, setItems] = useState<{ id: number, start: number, top: number, width: number, videoFile: File }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [ffmpeg, setFfmpeg] = useState<any>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const { createFFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpegInstance = createFFmpeg({ log: true });
      setFfmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      setItems(prevItems => [...prevItems, { id: nextId, start: 0, top: 0, width: 100, videoFile: file }]);
      setNextId(prevId => prevId + 1);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const updateItem = (id: number, start: number, top: number, width: number) => {
    setItems(items.map(item => item.id === id ? { ...item, start, top, width } : item));
  };

  const combineVideos = async () => {
    if (!ffmpeg || !ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    items.forEach(async (item, index) => {
      ffmpeg.FS('writeFile', `input${index}.mp4`, await fetchFile(item.videoFile));
    });

    const inputFiles = items.map((_, index) => `-i input${index}.mp4`).join(' ');
    const filterComplex = items.map((item, index) => `[${index}:v] setpts=PTS-STARTPTS, scale=320x240 [v${index}]; [${index}:a] aresample=async=1 [a${index}]`).join('; ');
    const filterConcat = items.map((_, index) => `[v${index}][a${index}]`).join('') + `concat=n=${items.length}:v=1:a=1 [v][a]`;

    await ffmpeg.run(...inputFiles.split(' '), '-filter_complex', `${filterComplex}; ${filterConcat}`, '-map', '[v]', '-map', '[a]', 'output.mp4');

    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    const link = document.createElement('a');
    link.href = videoURL;
    link.download = 'combined-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="timeline-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag & drop video files here, or click to select files</p>
      </div>
      <div className="timeline">
        {items.map(item => (
          <TimelineItem key={item.id} item={item} updateItem={updateItem} ffmpeg={ffmpeg} />
        ))}
      </div>
      <button onClick={combineVideos}>Combine Videos</button>
    </div>
  );
};

export default Timeline;
