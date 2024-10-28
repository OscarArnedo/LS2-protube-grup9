import './App.css';
import { useState, useRef, useEffect } from 'react';
import {login,register} from './services/users';
import './index.css';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoCard from './components/VideoCard';
import { fetchVideos } from './services/videos';
        
function App() {
  const divRef = useRef<HTMLDivElement>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [videos, setVideos] = useState([]);

  const handleLogin = async (username: string, password: string) => {
    try {
        const response = await login(username, password);
        console.log('Login successful:', response);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
    } catch (error) {
        console.error('Login failed:', error);
    }
  };
  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await register(name, email, password);
      console.log('Registration successful:', response);
      setShowRegister(false); 
      toast.success('Registration successful! You can now log in.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };
    
  useEffect(() => {
    const getVideos = async () => {
      try {
        const videosData = await fetchVideos();
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos');
      }
    };

    getVideos();
  }, []);

  return(
    <div className="App" ref={divRef}>
      <ToastContainer
              position="top-center" 
              autoClose={5000}
              hideProgressBar={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9999,
                  pointerEvents: 'none', 
              }} 
        />
      <h1 className="text-2xl font-bold mb-4">{showRegister ? 'Register' : 'Login'}</h1>
      {!isAuthenticated ? (
        <>
          {showRegister ? (
            <Register onRegister={handleRegister} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button
            className="mt-4 text-blue-500 underline"
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </>
      ) : (
        <header className="App-header">
          <h1>Videos</h1>
        </header>
        {/* { <div className="video-list">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            author={video.author}
            imageUrl={video.imageUrl}
          />
        ))}
        </div>} */}
        <div className="video-list">
                {videos.length > 0 ? (
                    videos.map((videoTitle, index) => (
                        <VideoCard 
                            key={index}
                            title={videoTitle}
                        />
                    ))
                ) : (
                    <p>No videos available</p>
                )}
            </div>
        </div>
      )}
  );  
}


export default App;
