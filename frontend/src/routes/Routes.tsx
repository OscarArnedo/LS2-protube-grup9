import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import HomeVideos from '../pages/HomeVideos.tsx';
import VideoPage from "../pages/VideoPage.tsx";

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
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
      <Route path="/video/:id" element={<VideoPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
