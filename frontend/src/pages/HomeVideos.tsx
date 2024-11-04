import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard.tsx';
import { VideosDTO } from '../types/videoInterfaces.tsx';
import {fetchImageMedia, fetchVideos} from '../services/videoService';


const HomeVideos: React.FC = () => {
    const [videos, setVideos] = useState<VideosDTO[]>([]);
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});

    const getVideos = async () => {
        try {
            const videosData: VideosDTO[] = await fetchVideos();
            console.log('Videos fetched:', videosData);
            setVideos(videosData);
            await getImages(videosData);
        } catch (error) {
            console.error('Error fetching videos');
        }
    };
    const getImages = async (videos: VideosDTO[]) => {
        try {
            const imagePromises = videos.map(async (video) => {
                const imageUrl = await fetchImageMedia(video.id);
                return { id: video.id, url: imageUrl };
            });
            const imagesData = await Promise.all(imagePromises);
            const imageUrlsMap = imagesData.reduce((acc, { id, url }) => {
                acc[id] = url;
                return acc;
            }, {} as { [key: number]: string });
            setImageUrls(imageUrlsMap);
        } catch (error) {
            console.error('Error fetching images');
        }
    };
    useEffect(() => {
        getVideos();
    }, []);

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
            image={imageUrls[video.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeVideos;
