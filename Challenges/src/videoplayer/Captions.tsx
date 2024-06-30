import React, { useEffect, useState } from 'react';

interface CaptionsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  activeCaptions: Caption | null;
}

interface Caption {
  src: string;
  label: string;
  srclang: string;
}

const Captions: React.FC<CaptionsProps> = ({ videoRef, activeCaptions }) => {
  const [captionText, setCaptionText] = useState<string>('');

  useEffect(() => {
    console.log('Captions component mounted. Active captions:', activeCaptions);
    const video = videoRef.current;
    if (!video || !activeCaptions) return;

    const updateCaption = () => {
      const track = Array.from(video.textTracks).find(
        (track) => track.language === activeCaptions.srclang && track.mode === 'showing'
      );

      console.log('Current text tracks:', video.textTracks);
      console.log('Active track:', track);

      if (track && track.activeCues && track.activeCues.length > 0) {
        const newCaptionText = (track.activeCues[0] as VTTCue).text;
        console.log('New caption text:', newCaptionText);
        setCaptionText(newCaptionText);
      } else {
        setCaptionText('');
      }
    };

    video.textTracks.addEventListener('cuechange', updateCaption);

    return () => {
      video.textTracks.removeEventListener('cuechange', updateCaption);
    };
  }, [videoRef, activeCaptions]);

  if (!activeCaptions || !captionText) {
    console.log('No active captions or caption text. Rendering null.');
    return null;
  }

  console.log('Rendering caption:', captionText);
  return (
    <div className="captions-container">
      <p className="caption-text">{captionText}</p>
    </div>
  );
};

export default Captions;