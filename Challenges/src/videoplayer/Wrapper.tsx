import VideoPlayer from './VideoPlayer'

function Wrapper() {

    const segments = [
        { name: 'Introduction', time: 0 },
        { name: 'Main Content', time: 30 },
        { name: 'Conclusion', time: 60 },
      ];
      const captions = [
        { src: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt', label: 'English', srclang: 'en' },
      ];

  return (
    <div className="wrapper">
        <VideoPlayer 
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" 
        poster="https://firebasestorage.googleapis.com/v0/b/blog-app-5ed76.appspot.com/o/0c87e672-a2c9-42c9-8d9c-f096bccfd52f%2Fthumbnail.webp?alt=media&token=8df07949-5a9f-48f4-bf95-8c5a2ad365b1"
        autoPlay={false}
        segments={segments}
        captions={captions}
      />
    </div>
  )
}

export default Wrapper