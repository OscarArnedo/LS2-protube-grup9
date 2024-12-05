import React, { useState } from 'react';
import loginModalIcon from '../assets/loginModalIcon.png';
import { setCookie } from '../utils/cookies';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<string>;
    onToggle: () => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin, onToggle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, logout } = useUser();

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        try {
            const token = await onLogin(username, password);
            setCookie('authToken', token, 7);
            login();
            toast.success('Login successful!');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            logout();
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
