import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { register } from '../services/userService.ts';
import 'react-toastify/dist/ReactToastify.css';

interface RegisterProps {
    onRegister: ( name: string, lastName: string, username: string, email: string, password: string) => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUpperCase && hasSpecialChar;
    };

    const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (!validatePassword(password)) {
            toast.error('Password must be at least 6 characters, contain an uppercase letter, and a special character.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        try {
            await register( username, email, password );
            // Llamar a onRegister para indicar que el registro fue exitoso
            onRegister(name, lastName, username, email, password);
        } catch (error) {
            toast.error('Error al registrarse. Intente nuevamente.');
        }
        toast.success('Registration successful!');
    };

    return (
        <div className="register-container">
            <h1 className="text-3xl font-bold mb-6">Register</h1>
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
                }} />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required/>
                <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required/>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required/>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className="border border-gray-300 p-2 mb-4 rounded w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required/>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition duration-300 w-fit">
                        Register
                    </button>
                </div>
            </form>
            <button 
                className="mt-4 text-blue-500 underline"
                onClick={() => navigate('/login')}
                > Already have an account? Login
            </button>
        </div>
    );
};

export default RegisterPage;