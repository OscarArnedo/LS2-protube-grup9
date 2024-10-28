import axios from 'axios'

export const fetchVideos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/videos');
    console.log('Videos fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos', error);
    throw error; // Puedes lanzar el error para que el componente lo maneje
  }
};