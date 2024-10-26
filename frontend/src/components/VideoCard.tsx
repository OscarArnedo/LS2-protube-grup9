import React from 'react';
import './VideoCard.css';

interface VideoCardProps {
    title: string;
    //author: string;
    //imageUrl: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title/*, author, imageUrl*/ }) => {
    return (
        <div className="video-card">
            <h3 className="video-card__title">{title}</h3>
        </div>
        // <div className="video-card">
        //     <img src={imageUrl} alt={title} className="video-card__image" />
        //     <div className="video-card__info">
        //         <h3 className="video-card__title">{title}</h3>
        //         <p className="video-card__author">{author}</p>
        //     </div>
        // </div>
    );
};

export default VideoCard;