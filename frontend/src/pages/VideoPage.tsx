import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {VideoMetaDataDTO, Like} from '../types/videoInterfaces';
import {fetchVideoById, fetchVideoMedia, updateComment, deleteComment, createComment} from '../services/videoService';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import {useUser} from '../contexts/UserContext';

const VideoPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [video, setVideo] = useState<VideoMetaDataDTO | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    const [likes, setLikes] = useState<Like[]>([]);
    const [dislikes, setDislikes] = useState<Like[]>([]);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState<string>('');
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [newCommentText, setNewCommentText] = useState<string>('');
    const {currentUser, isAuthenticated } = useUser();

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                if (!id) {
                    navigate('/');
                    return;
                }
                const videoData = await fetchVideoById(Number(id));
                setVideo(videoData);

                const url = await fetchVideoMedia(videoData.videoPath);
                setVideoUrl(url);

                setLikes(videoData.comments.map(comment => ({id: comment.id, count: 0})));
                setDislikes(videoData.comments.map(comment => ({id: comment.id, count: 0})));
                console.log('Current user:', currentUser);
                console.log('Video data:', videoData);
                console.log('Authenticated:', isAuthenticated);
            } catch (error) {
                console.error('Error fetching video data', error);
            }
        };

        fetchVideoData();
    }, [id, navigate]);

    const handleLike = (commentId: number) => {
        setLikes(likes.map(like =>
            like.id === commentId ? {...like, count: like.count + 1} : like
        ));
    };

    const handleDislike = (commentId: number) => {
        setDislikes(dislikes.map(dislike =>
            dislike.id === commentId ? {...dislike, count: dislike.count + 1} : dislike
        ));
    };

    const handleEdit = (commentId: number, commentText: string) => {
        setEditingCommentId(commentId);
        setEditingCommentText(commentText);
    };

    const handleSaveEdit = async (commentId: number) => {
        try {
            await updateComment(commentId, editingCommentText);
            console.log(commentId, editingCommentText);
            setVideo(prevVideo => {
                if (!prevVideo) return prevVideo;
                return {
                    ...prevVideo,
                    comments: prevVideo.comments.map(comment =>
                        comment.id === commentId ? {...comment, comment_text: editingCommentText} : comment
                    )
                };
            });

            setEditingCommentId(null);
            setEditingCommentText('');
        } catch (error) {
            console.error('Error updating comment', error);
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setVideo(prevVideo => {
                if (!prevVideo) return prevVideo;
                return {
                    ...prevVideo,
                    comments: prevVideo.comments.filter(comment => comment.id !== commentId)
                };
            });
        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };
    const handleCreateComment = async () => {
        try {
            const newComment = await createComment(Number(id), newCommentText);

            setVideo(prevVideo => {
                if (!prevVideo) return prevVideo;
                return {
                    ...prevVideo,
                    comments: [newComment, ...prevVideo.comments]
                };
            });
            setNewCommentText('');
        } catch (error) {
            console.error('Error creating comment', error);
        }
    };
    if (!video) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center p-4">
            {video && videoUrl && (
                <div className="w-full max-w-4xl">
                    <video
                        src={videoUrl}
                        controls
                        className="w-full h-auto rounded-lg shadow-lg mb-4"
                    />
                </div>
            )}
            <div className="w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center mb-4 h-full">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}
                    >
                        {video.owner.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-lg text-gray-600 text-left ml-2">{video.owner.name}</h2>
                </div>
                <p className="text-lg text-justify mb-12 whitespace-pre-line">
                    {showFullDescription ? video.description : `${video.description.substring(0, 100)}...`}
                    {video.description.length > 100 && (
                        <span
                            className="text-blue-500 cursor-pointer"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                            {showFullDescription ? ' Show Less' : ' Show More'}
                        </span>
                    )}
                </p>
            </div>

            <div className="w-full max-w-4xl bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Comments</h2>
                <div className="mt-4 flex items-center">
                    {isAuthenticated ? (
                        <>
                            <textarea
                                className="w-full p-2 border rounded mb-2 mr-2"
                                placeholder="Add a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                            />
                            <button
                                className="text-white bg-blue-500 hover:bg-blue-700 text-sm py-2 px-4 rounded"
                                onClick={handleCreateComment}
                            >
                                Add Comment
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-gray-600">Login to add a comment</p>
                    )}
                </div>
                {video.comments.map((comment) => {
                    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                    const userInitial = comment.author.name.charAt(0).toUpperCase();
                    return (
                        <div key={comment.id} className="flex mb-4 bg-white p-4 rounded-lg shadow">
                            <div className="mr-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold"
                                    style={{ backgroundColor: randomColor }}
                                >
                                    {userInitial}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-md font-bold text-left">{comment.author.name}</h3>
                                {editingCommentId === comment.id ? (
                                    <div>
                                        <textarea
                                            className="w-full p-2 border rounded"
                                            value={editingCommentText}
                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                        />
                                        <button
                                            className="text-blue-500 text-sm mr-2"
                                            onClick={() => handleSaveEdit(comment.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="text-blue-500 text-sm"
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditingCommentText('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 text-left max-w-full">{comment.comment_text}</p>
                                )}
                                <div className="flex items-center mt-2">
                                    <button
                                        className="text-blue-500 text-sm mr-4 flex items-center"
                                        onClick={() => handleLike(comment.id)}
                                    >
                                        <img src={like} alt="Like" className="w-5 h-5 inline-block mr-1" />
                                        <span>{likes.find(like => like.id === comment.id)?.count || 0}</span>
                                    </button>
                                    <button
                                        className="text-blue-500 text-sm mr-4 flex items-center"
                                        onClick={() => handleDislike(comment.id)}
                                    >
                                        <img src={dislike} alt="Dislike" className="w-5 h-5 inline-block mr-1" />
                                        <span>{dislikes.find(dislike => dislike.id === comment.id)?.count || 0}</span>
                                    </button>
                                    <div className="flex-grow"></div>
                                    {isAuthenticated && currentUser?.name === comment.author.name && (
                                        <>
                                            <button
                                                className="text-blue-500 text-sm mr-2"
                                                onClick={() => handleEdit(comment.id, comment.comment_text)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-blue-500 text-sm"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VideoPage;