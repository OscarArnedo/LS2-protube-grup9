import axios from 'axios'
import type {VideoMetaDataDTO, VideosDTO} from '../types/videoInterfaces'

export const fetchVideos = async (): Promise<VideosDTO[]> => {
  try {
    const response = await axios.get('http://localhost:8080/api/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching videos', error);
    throw error;
  }
};

export const fetchVideoById = async (id: number): Promise<VideoMetaDataDTO> => {
  try {
    const response = await axios.get(`http://localhost:8080/api/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video', error);
    throw error;
  }
};

export const fetchImageMedia = async (fileName: string): Promise<string> => await fetchMedia(fileName, 'image/webp');

export const fetchVideoMedia = async (fileName: string): Promise<string> => await fetchMedia(fileName, 'video/mp4');

const fetchMedia = async (fileName: string, fileType:string): Promise<string> => {
    try {
        const response = await axios.get(`http://localhost:8080/media/${fileName}`, {
            responseType: 'blob'
        });
        const imageBlob = new Blob([response.data], { type: fileType });
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error('Error fetching  media', error);
        throw error;
    }
}