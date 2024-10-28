import { useEffect, useState } from 'react';
import VideoCard from './components/VideoCard';
import './App.css';
import { fetchVideos } from './services/videos';

function App() {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const getVideos = async () => {
      try {
        const videosData = await fetchVideos();
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos');
      }
    };

    getVideos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Videos</h1>
      </header>
      {/* { <div className="video-list">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            author={video.author}
            imageUrl={video.imageUrl}
          />
        ))}
      </div>} */}
      <div className="video-list">
                {videos.length > 0 ? (
                    videos.map((videoTitle, index) => (
                        <VideoCard 
                            key={index}
                            title={videoTitle}
                        />
                    ))
                ) : (
                    <p>No videos available</p>
                )}
            </div>
    </div>
  );
}

export default App;
