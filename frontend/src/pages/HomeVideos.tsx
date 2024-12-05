// src/pages/HomeVideos.tsx
import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard.tsx';
import { VideosDTO } from '../types/videoInterfaces.tsx';
import { fetchVideos, fetchVideosByCategory, fetchCategories } from '../services/videoService';
import useScrollToTop from '../hooks/scrollToTop.tsx';
import LoadingComponent from '../components/Loading.tsx';
import { getImagesForVideos } from '../utils/functions.ts';

interface HomeVideosProps {
    searchQuery: string;
}

const HomeVideos: React.FC<HomeVideosProps> = ({ searchQuery }) => {
    const [videos, setVideos] = useState<VideosDTO[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<VideosDTO[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
    const { isVisible, scrollToTop } = useScrollToTop();
    const [isLoading, setIsLoading] = useState(true);

    const getVideos = async (category?: string) => {
        try {
            const videosData: VideosDTO[] = category ? await fetchVideosByCategory(category) : await fetchVideos();
            setVideos(videosData);
            setFilteredVideos(videosData);

            const imagesUrlsMap = await getImagesForVideos(videosData);
            setImageUrls(imagesUrlsMap);

            await new Promise(resolve => setTimeout(resolve, 400));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching videos');
            setIsLoading(false);
        }
    };

    const getCategories = async () => {
        try {
            const categoriesData: string[] = await fetchCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories');
        }
    };

    useEffect(() => {
        getVideos();
        getCategories();
    }, []);

    useEffect(() => {
        const handleSearch = () => {
            if (searchQuery.trim() === '') {
                setFilteredVideos(videos);
            } else {
                setFilteredVideos(
                    videos.filter(
                        video =>
                            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            video.owner.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
            }
        };
        handleSearch();
    }, [searchQuery, videos]);

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
            getVideos();
        } else {
            setSelectedCategory(category);
            getVideos(category);
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-4 py-2 m-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <>
                    <div className="flex flex-wrap justify-center">
                        {filteredVideos.map((video) => (
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