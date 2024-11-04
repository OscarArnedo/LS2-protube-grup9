import './App.css';
import { useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {login, register} from './services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/Routes';
        
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (username: string, password: string) => {
    try {
        const response = await login(username, password);
        console.log('LoginPage successful:', response);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        navigate('/');
    } catch (error) {
        console.error('LoginPage failed:', error);
        toast.error('LoginPage failed. Please check your credentials');
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
      />
    </div>
  );
}

export default App;