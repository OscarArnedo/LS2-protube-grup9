import './App.css';
import logo from './assets/logoProtube.png';
import loginIcon from './assets/loginIcon.png';
import logoutIcon from './assets/logoutIcon.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from './services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './components/Modal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppRoutes from './routes/Routes';
import { getCookie, setCookie, deleteCookie } from './utils/cookies';
import { useUser } from './contexts/UserContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isRegistering, setRegistering] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const { fetchCurrentUser } = useUser();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

    useEffect(() => {
        const token = getCookie('authToken');
        console.log('Token:', token);
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (username: string, password: string): Promise<string> => {
        try {
            const response = await login(username, password);
            console.log('Login successful:', response);
            setIsAuthenticated(true);
            setUserName(username);
            localStorage.setItem('userName', username);
            setCookie('authToken', response.access_token, 7);
            await fetchCurrentUser();
            setModalOpen(false);
            navigate('/');
            return response.access_token;
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials');
            throw error;
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

    const handleLogout = async () => {
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('userName');
        deleteCookie('authToken');
        await fetchCurrentUser();
        navigate('/');
    };

    const handleProfile = () => {
        setDropdownOpen(false);
        navigate('/profile');
    };

    const handleHome = () => {
        setDropdownOpen(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="App">
            <ToastContainer />

            <header className="header bg-gray-800 text-white p-4 flex justify-between items-center gap-4">
    <div className="flex items-center gap-2">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <h1 className="text-lg font-bold">PROTUBE</h1>
        </button>
    </div>

    {/* Barra de Búsqueda */}
    <div className="flex-grow mx-4 max-w-lg">
        <div className="flex items-center justify-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 rounded bg-gray-200 text-black"
            />
        </div>
    </div>

    {/* Botón de Login/Logout */}
    <nav className="relative">
        {location.pathname !== '/login' && location.pathname !== '/register' && (
            isAuthenticated ? (
                <div className="relative">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer bg-orange-500"
                        onClick={toggleDropdown}
                    >
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {location.pathname === '/profile' ? (
                                <button
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={handleHome}
                                >
                                    Home
                                </button>
                            ) : (
                                <button
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={handleProfile}
                                >
                                    Profile
                                </button>
                            )}
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                <span>Logout</span>
                                <img src={logoutIcon} alt="Logout" className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    className="text-white py-1 px-4 rounded hover:bg-gray-900 transition duration-300 flex items-center gap-2"
                    onClick={() => setModalOpen(true)}
                >
                    Login
                    <img src={loginIcon} alt="Login" className="h-6 w-6" />
                </button>
            )
        )}
    </nav>
</header>

            <main style={{ paddingTop: '100px' }}>
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                    {isRegistering ? (
                        <RegisterPage onRegister={handleRegister} onToggle={() => setRegistering(false)} />
                    ) : (
                        <LoginPage onLogin={handleLogin} onToggle={() => setRegistering(true)} />
                    )}
                </Modal>

                <AppRoutes searchQuery={searchQuery}/>

            </main>
        </div>
    );
}

export default App;