import { fetchImageMedia } from '../services/videoService';
import { VideosDTO } from '../types/videoInterfaces';

export const getImagesForVideos = async (videos: VideosDTO[]): Promise<{ [key: number]: string }> => {
    try {
        const imagePromises = videos.map(async (video) => {
            const imageUrl = await fetchImageMedia(video.imagePath);
            return { id: video.id, url: imageUrl };
        });
        const imagesData = await Promise.all(imagePromises);
        return imagesData.reduce((acc, { id, url }) => {
            acc[id] = url;
            return acc;
        }, {} as { [key: number]: string });
    } catch (error) {
        console.error('Error fetching images:', error);
        return {};
    }
};
