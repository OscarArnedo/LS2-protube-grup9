import './App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from './services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './components/Modal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppRoutes from './routes/Routes';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isRegistering, setRegistering] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await login(username, password);
            console.log('LoginPage successful:', response);
            setIsAuthenticated(true);
            localStorage.setItem('token', response.token);
            setModalOpen(false);
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
            setModalOpen(false);
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        navigate('/');
    };

    const openLoginModal = () => {
      setRegistering(false);
      setModalOpen(true);
    };

    const openRegisterModal = () => {
      setRegistering(true);
      setModalOpen(true);
    };

    return (
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
                        <>
                            <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-300 w-fit" onClick={openLoginModal}>
                                Login
                            </button>
                        </>
                    )
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                {isRegistering ? (
                    <RegisterPage onRegister={handleRegister} onToggle={openLoginModal} />
                ) : (
                    <LoginPage onLogin={handleLogin} onToggle={openRegisterModal} />
                )}
            </Modal>

            <AppRoutes />
        </div>
    );
}

export default App;