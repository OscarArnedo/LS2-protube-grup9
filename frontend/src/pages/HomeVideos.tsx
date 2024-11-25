import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard.tsx';
import { VideosDTO } from '../types/videoInterfaces.tsx';
import {fetchVideos} from '../services/videoService';
import useScrollToTop from '../hooks/scrollToTop.tsx';
import LoadingComponent from '../components/Loading.tsx';
import { getImagesForVideos } from '../utils/functions.ts';

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
            
            const imagesUrlsMap = await getImagesForVideos(videosData);
            setImageUrls(imagesUrlsMap);

            await new Promise(resolve => setTimeout(resolve, 400));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching videos');
            setIsLoading(false);
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
                        className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-900 transition duration-300"
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
