import axios from 'axios'
import type {LoginResponse, UserDTO} from '../types/userInterfaces'

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

export const register = async (name: string, email: string, password: string): Promise<UserDTO> => {
    try {
        const response = await axios.post<UserDTO>('http://localhost:8080/api/users/create', {
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