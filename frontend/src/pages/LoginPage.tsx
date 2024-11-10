import React, { useState } from 'react';
import loginModalIcon from '../assets/loginModalIcon.png';

interface LoginProps {
    onLogin: (username: string, password: string) => void;
    onToggle: () => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin, onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            await onLogin(username, password);
        } catch (error) {
            console.log('LoginPage failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <img src={loginModalIcon} alt="User Icon" className="w-24 h-24 mb-4" />
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
                onClick={onToggle}
                > Don't have an account? Register
            </button>
        </div>
    );
};

export default LoginPage;
