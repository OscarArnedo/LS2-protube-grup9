import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            await onLogin(username, password);
        } catch (error) {
            console.log('LoginPage failed. Please check your credentials.');
        }
    };

    return (
        <div className="lex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Login</h1>
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
            <button 
                className="mt-4 text-blue-500 underline"
                onClick={() => navigate('/register')}
                > Don't have an account? Register
            </button>
        </div>
    );
};

export default LoginPage;
