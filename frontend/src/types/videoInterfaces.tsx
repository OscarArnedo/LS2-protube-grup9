import type {UserDTO} from './userInterfaces';

export interface VideosDTO {
    id: number;
    title: string;
    owner: string;
    image: string;
}

export interface HomeVideosDTO {
    videos: VideosDTO[];
}

export interface VideoMetaDataDTO {
    id: number;
    width: number;
    height: number;
    title: string;
    owner: UserDTO;
    duration: number;
}