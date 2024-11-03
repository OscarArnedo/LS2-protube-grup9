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

export const fetchVideoMedia = async (id: number): Promise<string> => {
  try {
    const response = await axios.get(`http://localhost:8080/media/${id}.mp4`, {
      responseType: 'blob'
    });
    const videoBlob = new Blob([response.data], { type: 'video/mp4' });
    return URL.createObjectURL(videoBlob);
  } catch (error) {
    console.error('Error fetching video media', error);
    throw error;
  }
};