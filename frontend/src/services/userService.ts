import axios from 'axios'
import type {LoginResponse, RegisterResponse} from '../types/userInterfaces'

  export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>('http://localhost:8080/authenticate', {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
        const response = await axios.post<RegisterResponse>('http://localhost:8080/api/users/create', { 
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