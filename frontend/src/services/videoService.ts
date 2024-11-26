import axios from 'axios'
import type {VideoMetaDataDTO, VideosDTO} from '../types/videoInterfaces'
import {getCookie} from "../utils/cookies.ts";
import { getEnv } from '../utils/Env.ts';

export const fetchVideos = async (): Promise<VideosDTO[]> => {
  try {
    const response = await axios.get(getEnv().API_BASE_URL+'/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching videos', error);
    throw error;
  }
};

export const fetchVideoById = async (id: number): Promise<VideoMetaDataDTO> => {
  try {
    const response = await axios.get(getEnv().API_BASE_URL+`/videos/${id}`);
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
        const response = await axios.get(getEnv().MEDIA_BASE_URL+`/${fileName}`, {
            responseType: 'blob'
        });
        const imageBlob = new Blob([response.data], { type: fileType });
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error('Error fetching  media', error);
        throw error;
    }
}

export const updateComment = async (commentId: number, commentText: string) => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axios.patch(
        getEnv().API_BASE_URL+`/comments/${commentId}/text`,
        { text: commentText },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const deleteComment = async (commentId: number) => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axios.delete(getEnv().API_BASE_URL+`/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const createComment = async (videoId: number, text: string) => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axios.post(
        getEnv().API_BASE_URL+'/comments',
        {
            "videoId": videoId,
            "comment_text": text},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
export const getCommentsByAuthor = async () => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axios.get(
        getEnv().API_BASE_URL+`/comments/author`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const getVideosByAuthor = async () => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    const response = await axios.get(
        getEnv().API_BASE_URL+`/videos/author`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
}