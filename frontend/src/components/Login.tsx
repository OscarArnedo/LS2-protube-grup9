import React, { useState } from 'react';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            await onLogin(username, password);
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className='border border-gray-300 p-2 mb-4 rounded w-full'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-300 w-fit"
                        > Login
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>} {/* Muestra el mensaje de error */}
        </div>
    );
};

export default Login;
