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

    const handleClear = () => {
        setUsername('');
        setPassword('');
        setError('');
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="button" onClick={handleClear}>
                        Clear the form
                    </button>
                    <button type="submit">Submit</button>
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra el mensaje de error */}
        </div>
    );
};

export default Login;
