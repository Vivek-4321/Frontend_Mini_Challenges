import React, { useRef, useEffect } from 'react';

interface AmbientBackgroundProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isAmbientModeOn: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ videoRef, isAmbientModeOn }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const updateAmbientBackground = () => {
      if (!isAmbientModeOn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(updateAmbientBackground);
    };

    updateAmbientBackground();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef, isAmbientModeOn]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-background"
      width={1920}
      height={1080}
    />
  );
};

export default AmbientBackground;
