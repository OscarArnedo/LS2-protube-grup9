import React from 'react';
import VideoCard from '../components/VideoCard.tsx';
import { HomeVideosDTO } from '../types/videoInterfaces.tsx';


const HomeVideos: React.FC<HomeVideosDTO> = ({ videos }) => {
    return (
    <div>
      <header className="App-header m-10">
        <h1 className="text-3xl font-bold my-4">Welcome to ProTube</h1>
      </header>
      <div className="flex flex-wrap justify-center">
        {videos.map((video) => (
          <VideoCard
            id={video.id}
            title={video.title}
            owner={video.owner}
            image={video.image}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeVideos;
