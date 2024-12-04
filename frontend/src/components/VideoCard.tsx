import React from 'react';
import { VideosDTO } from '../types/videoInterfaces';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps extends VideosDTO {
        category?: string; // Make category optional
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, owner, imagePath, category }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/video/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-80 m-4 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col"
            style={{ height: '300px' }}
        >
            <img
                src={imagePath}
                className="w-full h-48 object-cover"
                alt={imagePath}
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
                <p className="text-gray-600 text-sm">{owner}</p>
                {category && <p className="text-gray-500 text-xs mt-2">{category}</p>} {/* Conditionally render category */}
            </div>
        </div>
    );
};

export default VideoCard;