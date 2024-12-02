import type {UserDTO} from './userInterfaces';

export interface VideosDTO {
    id: number;
    title: string;
    owner: string;
    imagePath: string;
}

export interface HomeVideosDTO {
    videos: VideosDTO[];
}

export interface CommentDTO {
    id: number;
    videoId: number;
    comment_text: string;
    author: UserDTO;
    video?: {
        title: string;
        owner: string;
    };
}

export interface VideoMetaDataDTO {
    id: number;
    width: number;
    height: number;
    title: string;
    owner: UserDTO;
    duration: number;
    imagePath: string;
    videoPath: string;
    comments: CommentDTO[];
    description: string;
    tags: string[];
    categories: string[];
}

export interface Like{
    id: number;
    count: number;
}