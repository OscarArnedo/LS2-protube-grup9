import React from 'react';
import { VideosDTO } from '../types/videoInterfaces';
import { useNavigate } from 'react-router-dom';

const VideoCard: React.FC<VideosDTO> = ({ id, title, owner, image }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/video/${id}`);
    };

    return (
        <div onClick={handleClick} className="bg-white rounded-lg shadow-lg overflow-hidden w-64 m-4 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <img src={image} className="w-full h-48 object-cover" alt = {image}/>
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{owner}</p>
            </div>
        </div>
    );
};

export default VideoCard;