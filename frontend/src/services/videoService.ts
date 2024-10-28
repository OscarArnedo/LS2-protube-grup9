import axios from 'axios'
import type {VideosDTO} from '../types/videoInterfaces'

export const fetchVideos = async (): Promise<VideosDTO[]> => {
  try {
    const response = await axios.get('http://localhost:8080/api/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching videos', error);
    throw error;
  }
};