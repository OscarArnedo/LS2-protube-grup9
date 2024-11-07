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
    comment_text: string;
    author: UserDTO;
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
}

export interface Like{
    id: number;
    count: number;
}