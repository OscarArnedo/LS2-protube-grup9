import React, {useEffect, useState} from "react";
import VideoCard from "../components/VideoCard";
import Modal from '../components/Modal';
import {CommentDTO} from "../types/videoInterfaces.tsx";
import {getCommentsByAuthor} from "../services/videoService.ts";
import {useUser} from "../contexts/UserContext.tsx"; // Asegúrate de ajustar la ruta de importación según tu estructura de proyecto

const UserProfilePage: React.FC = () => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const {currentUser} = useUser();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentsByAuthor();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments().then(r => console.log('Comments fetched:', r));
  }, []);

  const handleUploadVideo = () => {
    setUploadModalOpen(true);
  };

  const handleCloseModal = () => {
    setUploadModalOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica para manejar la subida de videos
    if (videoFile) {
      console.log('Video uploaded:', videoTitle, videoFile);
      // Aquí puedes añadir la lógica para subir el video al servidor
    }
    setUploadModalOpen(false);
  };

  // Ejemplo de datos de videos del usuario
  const userVideos = [
    { id: 1, title: 'Mi primer video', owner: 'Jane Doe', imagePath: '/assets/video1-thumbnail.png' },
    { id: 2, title: 'Tutorial de React', owner: 'Jane Doe', imagePath: '/assets/video2-thumbnail.png' },
    // Añade más videos según sea necesario
  ];


  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
      {/* Información del usuario */}
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-200 text-gray-700 text-3xl font-bold">
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h1>
            <p className="text-gray-600">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      {/* Botón para subir videos */}
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg mb-6">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          onClick={handleUploadVideo}
        >
          Upload Video
        </button>
      </div>

      {/* Sección de videos */}
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">My Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userVideos.map(video => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>

      {/* Sección de comentarios */}
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">My Comments</h2>
        {/* Tarjeta de comentario */}
        {comments.map((comment, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4 shadow">
              <p className="text-gray-600 text-sm text-left">{comment.comment_text}</p>
            </div>
        ))}
      </div>

      {/* Modal para subir videos */}
      <Modal isOpen={isUploadModalOpen} onClose={handleCloseModal}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Upload Video</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoTitle">
                Video Title
              </label>
              <input
                type="text"
                id="videoTitle"
                name="videoTitle"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoFile">
                Video File
              </label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Upload
              </button>
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfilePage;