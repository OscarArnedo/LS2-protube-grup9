import './App.css';
import logo from './assets/logoProtube.png';
import search from './assets/searchIcon.png';
import loginIcon from './assets/loginIcon.png';
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
    const [searchQuery, setSearchQuery] = useState("");

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

    /*const openLoginModal = () => {
      setRegistering(false);
      setModalOpen(true);
    };

    const openRegisterModal = () => {
      setRegistering(true);
      setModalOpen(true);
    };*/

    const handleSearch = () => {
      console.log("Buscar:", searchQuery);
  };
  //ALGO ASI LEER PARA EL BUSCADOR
  const [articles, setArticles] = useState([
    { id: 1, title: "Primer artículo" },
    { id: 2, title: "Segundo artículo" },
    { id: 3, title: "Tercer artículo" },
  ]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
        <ToastContainer />

        <header className="header bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button onClick={() => navigate('/')} className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-12 w-12" />
                    <h1 className="text-lg font-bold">PROTUBE</h1>
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="search-bar flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-1 rounded bg-gray-200 text-black"
                />
                <button
                    onClick={handleSearch}
                >
                    <img src={search} alt="Search" className="h-6 w-6" />
                </button>
            </div>

            {/* Botón de Login/Logout */}
            <nav>
                {location.pathname !== '/login' && location.pathname !== '/register' && (
                    isAuthenticated ? (
                        <button className="text-white py-1 px-4 rounded hover:bg-gray-900 transition duration-300" onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <button 
                            className="text-white py-1 px-4 rounded hover:bg-gray-900 transition duration-300 flex items-center gap-2" onClick={() => setModalOpen(true)}>
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

            <AppRoutes />
        </main>
    </div>
);
}

export default App;