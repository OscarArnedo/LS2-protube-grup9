import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import HomeVideos from '../components/HomeVideos';

interface AppRoutesProps {
  handleLogin: (username: string, password: string) => Promise<void>;
  handleRegister: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  videos: Array<{ id: number; title: string; owner: string; image: string }>;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ handleLogin, handleRegister/*, isAuthenticated*/, videos }) => {
  return (
    <Routes>
      <Route path="/" element={<HomeVideos videos={videos} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
