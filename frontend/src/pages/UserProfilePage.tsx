import React, {useEffect, useState} from "react";
import VideoCard from "../components/VideoCard";
import Modal from '../components/Modal';
import {CommentDTO, VideosDTO} from "../types/videoInterfaces.tsx";
import {getVideosByAuthor, getCommentsByAuthor, fetchVideoById, updateVideo, deleteVideo} from "../services/videoService.ts";
import {useUser} from "../contexts/UserContext.tsx";
import { getImagesForVideos } from "../utils/functions.ts";
import { toast } from "react-toastify";

const UserProfilePage: React.FC = () => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [videoTags, setVideoTags] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [videos, setVideos] = useState<VideosDTO[]>([]);
  const {currentUser} = useUser();
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentsData = await getCommentsByAuthor();
        const enrichedComments = await enrichCommentsWithVideoData(commentsData);
        setComments(enrichedComments);

        const videosData = await getVideosByAuthor();
        setVideos(videosData);

        const imagesUrlsMap = await getImagesForVideos(videosData);
        setImageUrls(imagesUrlsMap);


      // Fetch categories from the database
      fetchCategories();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

    //fetchData().then(r => console.log('Data fetched:', r));

  //}, []);
  const fetchCategories = async () => {
    // Lógica para obtener las categorías de la base de datos
    const fetchedCategories = ['Category 1', 'Category 2', 'Category 3']; // Ejemplo de categorías
    setCategories(fetchedCategories);
  };

  const handleUploadVideo = () => {
    setUploadPopupOpen(true);
  };

  const handleClosePopup = () => {
    setUploadPopupOpen(false);
  };

  const handleAddTag = () => {
    if (newTag && !videoTags.includes(newTag)) {
      setVideoTags([...videoTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setVideoTags(videoTags.filter(t => t !== tag));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica para manejar la subida de videos
    if (videoFile  && thumbnailFile) {
      console.log('Video uploaded:', videoTitle, videoDescription, videoCategory, videoTags, videoFile, thumbnailFile);
      // Aquí puedes añadir la lógica para subir el video al servidor
    }
    setUploadPopupOpen(false);
  };

  const handleDelete = (id: number) => {
    setCurrentVideoId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (currentVideoId !== null) {
      try {
        await deleteVideo(currentVideoId);
        setVideos(videos.filter((video) => video.id !== currentVideoId));
        console.log("Deleted video with id:", currentVideoId);
        toast.success("Video deleted successfully");
      } catch (error) {
        console.error("Error deleting video:", error);
        toast.error("Error deleting video");
      }
    }
    setDeleteModalOpen(false);
    setCurrentVideoId(null);
  };

  const handleEdit = async (video: VideosDTO) => {
    setCurrentVideoId(video.id);
    setEditTitle(video.title);
    try {
      const videoData = await fetchVideoById(video.id);
      setEditDescription(videoData.description || '');
      setEditModalOpen(true);
    }
    catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  const saveEdit = async () => {
    if (currentVideoId !== null) {
      try {
        await updateVideo(currentVideoId, editTitle, editDescription);
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === currentVideoId
              ? { ...video, title: editTitle }
              : video
          )
        );
        console.log("Edited video:", currentVideoId, editTitle, editDescription);
        toast.success("Video updated successfully");
      } catch (error) {
        console.error("Error updating video:", error);
        toast.error("Error updating video");
      }
    }
    setEditModalOpen(false);
    setCurrentVideoId(null);
  };

  const enrichCommentsWithVideoData = async (comments: CommentDTO[]) => {
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          const videoData = await fetchVideoById(comment.videoId);
          return {
            ...comment,
            video: {
              title: videoData.title,
              owner: videoData.owner.name,
            },
          };
        } catch (error) {
          console.error(`Error fetching video data for videoId ${comment.videoId}:`, error);
          return comment;
        }
      })
    );
    return enrichedComments;
  };


  return (
      <div className="flex flex-col items-center bg-gray-50 min-h-screen py-10">
        {/* Información del usuario */}
        <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-orange-500 text-gray-700 text-3xl font-bold">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6 flex flex-col text-left">
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
          {videos.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-600 text-sm text-center">No videos yet</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-1 justify-items-center">
                {videos.map((video) => (
                    <div key={video.id}>
                      <VideoCard {...video} imagePath={imageUrls[video.id]} />
                      <div className="flex justify-start mt-2 space-x-2 ml-4">
                        <button
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
                            onClick={() => handleEdit(video)}
                        >
                          Edit
                        </button>
                        <button
                            className="bg-black text-white px-4 py-2 rounded hover:bg-red-500 transition duration-300"
                            onClick={() => handleDelete(video.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Sección de comentarios */}
        <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">My Comments</h2>
          {comments.length === 0 && (
              <p className="text-gray-600 text-sm text-center">No comments yet</p>
          )}
          {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 rounded-lg p-4 mb-4 shadow">
                <p className="text-gray-800 font-bold text-sm text-left">
                  {comment.video?.title || 'Unknown Title'} by {comment.video?.owner || 'Unknown Owner'}
                </p>
                <p className="text-gray-600 text-sm text-left">{comment.comment_text}</p>
              </div>
          ))}
        </div>

        {/* Modal para eliminar */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this video?</h3>
          <div className="flex justify-between">
            <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </Modal>

        {/* Modal para editar */}
        <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <h3 className="text-lg font-bold mb-4">Edit video</h3>
          <div>
            <label className="block text-gray-700">Title</label>
            <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
            />
            <label className="block text-gray-700">Descripción</label>
            <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </Modal>

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

  export default UserProfilePage;