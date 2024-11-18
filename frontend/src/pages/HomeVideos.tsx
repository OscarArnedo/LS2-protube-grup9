import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard.tsx';
import { VideosDTO } from '../types/videoInterfaces.tsx';
import {fetchImageMedia, fetchVideos} from '../services/videoService';
import useScrollToTop from '../hooks/scrollToTop.tsx';
import LoadingComponent from '../components/Loading.tsx';

const HomeVideos: React.FC = () => {
    const [videos, setVideos] = useState<VideosDTO[]>([]);
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
    const { isVisible, scrollToTop } = useScrollToTop();
    const [isLoading, setIsLoading] = useState(true);

    const getVideos = async () => {
        try {
            const videosData: VideosDTO[] = await fetchVideos();
            console.log('Videos fetched:', videosData);
            setVideos(videosData);
            await getImages(videosData);

            await new Promise(resolve => setTimeout(resolve, 400));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching videos');
            setIsLoading(false);
        }
    };
    const getImages = async (videos: VideosDTO[]) => {
        try {
            const imagePromises = videos.map(async (video) => {
                const imageUrl = await fetchImageMedia(video.imagePath);
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
          {isLoading ? (
              <LoadingComponent />
          ) : (
              <>
                  <header className="App-header m-10">
                      <h1 className="text-3xl font-bold my-4">Welcome to ProTube</h1>
                  </header>
                  <div className="flex flex-wrap justify-center">
                      {videos.map((video) => (
                          <VideoCard
                              key={video.id}
                              id={video.id}
                              title={video.title}
                              owner={video.owner}
                              imagePath={imageUrls[video.id]}
                          />
                      ))}
                  </div>
                  {isVisible && (
                      <button 
                          onClick={scrollToTop} 
                          className="fixed bottom-4 right-4 bg-black text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-800 transition duration-300"
                      >
                          ↑
                      </button>
                  )}
              </>
          )}
      </div>
  );
};

export default HomeVideos;
