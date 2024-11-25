import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeVideos from '../pages/HomeVideos.tsx';
import VideoPage from "../pages/VideoPage.tsx";
import UserProfile from '../pages/UserProfilePage.tsx';

interface AppRoutesProps {
  
}

const AppRoutes: React.FC<AppRoutesProps> = ({ /*, isAuthenticated*/ }) => {
  return (
    <Routes>
      <Route path="/" element={<HomeVideos />} />
      <Route path="/video/:id" element={<VideoPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
