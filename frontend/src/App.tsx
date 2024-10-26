import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from './components/VideoCard';
import logo from './assets/logo.svg';
import './App.css';

// This is your entry point
// Feel free to modify ANYTHING in this file

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/videos');
            console.log('Videos fetched:', response.data);
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching videos', error);
        }
    };

    fetchVideos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
