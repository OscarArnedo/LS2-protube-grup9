import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoMetaDataDTO } from '../types/videoInterfaces';
import { fetchVideoById, fetchVideoMedia } from '../services/videoService';

const VideoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [video, setVideo] = useState<VideoMetaDataDTO | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('Error fetching video data', error);
            }
        };

        fetchVideoData();
    }, [id, navigate]);

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
                <h2 className="text-lg text-gray-600 mb-4">{video.owner.name}</h2>
            </div>
            <div className="w-full max-w-4xl">
                <h2 className="text-lg font-bold mb-2">Comments</h2>
                {video.comments.map((comment) => (
                    <div key={comment.id} className="flex mb-4">
                        <div className="mr-4">
                            <img
                                src={comment.author.avatarUrl}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                        <div>
                            <h3 className="text-md font-bold">{comment.author.name}</h3>
                            <p className="text-sm text-gray-600">{comment.comment_text}</p>
                            <div className="flex items-center mt-2">
                                <button className="text-blue-500 text-sm mr-4">Like</button>
                                <button className="text-blue-500 text-sm">Reply</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPage;