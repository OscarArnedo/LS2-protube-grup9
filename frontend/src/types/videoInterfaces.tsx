export interface VideosDTO {
    id: number;
    title: string;
    owner: string;
    image: string;
}

export interface HomeVideosDTO {
    videos: VideosDTO[];
}