import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails } from '../services/userService';
import { getCookie } from '../utils/cookies';

import { UserDTO, UserContextType } from '../types/userInterfaces'

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const login = () => {
        setIsAuthenticated(true);
      };
    
      const logout = () => {
        setIsAuthenticated(false);
      };

    const fetchCurrentUser = async () => {
        const token = getCookie('authToken');
        if (!token) {
            setCurrentUser(null);
            setIsAuthenticated(false);
            return;
        }

        try {
            const user = await getUserDetails();
            setCurrentUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, isAuthenticated, login, logout, fetchCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};