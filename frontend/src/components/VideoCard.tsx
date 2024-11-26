import React, { useState, useEffect, useRef } from 'react';
import { VideosDTO } from '../types/videoInterfaces';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Modal from './Modal';
import { fetchVideoById, updateVideo, deleteVideo } from '../services/videoService';

interface VideoCardProps extends VideosDTO {
    refreshVideos?: () => Promise<void>; // Función para refrescar datos
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, owner, imagePath, refreshVideos }) => {
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleCardClick = () => {
        navigate(`/video/${id}`);
    };

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleEditClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditModalOpen(true);
        setIsDropdownOpen(false);
        try {
            const videoData = await fetchVideoById(id); // Recupera datos extendidos del video
            setEditDescription(videoData.description || '');
        } catch (error) {
            console.error('Error fetching video metadata:', error);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleEditSubmit = async () => {
        try {
            await updateVideo(id, editTitle, editDescription);
            console.log('Video updated successfully');
            setEditModalOpen(false);
            if (refreshVideos) await refreshVideos(); // Refresca datos tras editar
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteVideo(id);
            console.log('Video deleted successfully');
            setDeleteModalOpen(false);
            if (refreshVideos) await refreshVideos(); // Refresca datos tras eliminar
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            onClick={handleCardClick}
            className="relative bg-white rounded-lg shadow-lg overflow-hidden w-80 m-4 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
        >
            <img src={imagePath} className="w-full h-48 object-cover" alt={title} />
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{owner}</p>
            </div>

            {currentUser?.name === owner && (
                <div
                    className="absolute top-2 right-2 flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-400 focus:outline-none"
                        onClick={toggleDropdown}
                        style={{ lineHeight: 0 }}
                    >
                        <span className="text-lg font-bold leading-none">...</span>
                    </button>
                    {isDropdownOpen && (
                        <div
                            className="absolute right-0 mt-4 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleEditClick}
                                className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 justify-left"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 justify-left"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
            >
                <div
                    onClick={(e) => e.stopPropagation()} // Evita propagación al contenedor principal
                >
                    <h2 className="text-xl font-bold mb-4">Edit Video</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows={4}
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditModalOpen(false);
                            }}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditSubmit();
                            }}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
            >
                <div
                    onClick={(e) => e.stopPropagation()} // Evita propagación al contenedor principal
                >
                    <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                    <p className="text-gray-700 mb-4">
                        Do you really want to delete this video? This action cannot be undone.
                    </p>
                    <div className="flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModalOpen(false);
                            }}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConfirm();
                            }}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default VideoCard;