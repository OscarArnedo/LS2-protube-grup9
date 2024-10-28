import React from 'react';
import { VideosDTO } from '../types/videoInterfaces';

const VideoCard: React.FC<VideosDTO> = ({ /*id,*/ title, owner, image }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-64 m-4">
            <img src={`data:image/webp;base64,${image}`} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{owner}</p>
            </div>
        </div>
    );
};

export default VideoCard;