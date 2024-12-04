import axios from 'axios'
import type {LoginResponse, UserDTO} from '../types/userInterfaces'
import {getCookie} from "../utils/cookies";
import { getEnv } from '../utils/Env.ts';

  export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(getEnv().BASE_URL+'/authenticate', {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const register = async (name: string, email: string, password: string): Promise<UserDTO> => {
    try {
        const response = await axios.post<UserDTO>(getEnv().API_BASE_URL+'/users/create', {
            name,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const getUserDetails = async () => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    try {
        const response = await axios.get<UserDTO>(getEnv().API_BASE_URL+'/users/userDetails',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const updateUser = async (name: string, email: string, password: string): Promise<UserDTO> => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    try {
        const response = await axios.put<UserDTO>(getEnv().API_BASE_URL + '/users', {
            name,
            email,
            password,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (): Promise<void> => {
    const token = getCookie('authToken');
    if (!token) {
        throw new Error('No auth token found');
    }
    try {
        await axios.delete(getEnv().API_BASE_URL + '/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};