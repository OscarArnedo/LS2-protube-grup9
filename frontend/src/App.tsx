import './App.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {login, register} from './services/userService';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchVideos } from './services/videoService';
import { VideosDTO } from './types/videoInterfaces';
import AppRoutes from './routes/Routes';
        
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videos, setVideos] = useState<VideosDTO[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (username: string, password: string) => {
    try {
        const response = await login(username, password);
        console.log('Login successful:', response);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        navigate('/');
    } catch (error) {
        console.error('Login failed:', error);
        toast.error('Login failed. Please check your credentials');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await register(name, email, password);
      console.log('Registration successful:', response); 
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };
    
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const getVideos = async () => {
      try {
        const videosData: VideosDTO[] = await fetchVideos();
        console.log('Videos fetched:', videosData);
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos');
      }
    };
    getVideos();
  }, []);


  return(
    <div className="App">
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
      <div className="flex justify-end p-4">
        {location.pathname !== '/login' && location.pathname !== '/register' && ( 
          isAuthenticated ? (
            <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-300 w-fit" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-300 w-fit" onClick={() => navigate('/login')}>
              Login
            </button>
          )
        )}
      </div>

      <AppRoutes
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        isAuthenticated={isAuthenticated}
        videos={videos}
      />
    </div>
  );
}

export default App;