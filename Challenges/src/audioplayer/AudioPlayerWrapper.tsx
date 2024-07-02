import AudioPlayer from './AudioPlayer';
import './AudioPlayerWrapper.css'

export default function AudioPlayerWrapper() {
  return (
    <div className="audio-app">
      <AudioPlayer src="https://firebasestorage.googleapis.com/v0/b/blog-app-5ed76.appspot.com/o/Hosanna.mp3?alt=media&token=815ca1a7-ab80-4aa3-8f8c-5a2eb00bb43f" />
    </div>
  );
}