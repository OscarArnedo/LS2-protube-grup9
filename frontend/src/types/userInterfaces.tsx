export interface LoginResponse {
    access_token: string;
}
export interface UserDTO {
    id: string;
    name: string;
    email: string;
    password?: string;
}

export interface RegisterDTO {
    name: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}

export interface AuthenticateDTO {
    username: string;
    password: string;
}

export type UsersResponseFromAPI = Array<{
    name: string;
    email: string;
    password: string;
}>

export interface UserContextType {
    currentUser: UserDTO | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    fetchCurrentUser: () => Promise<void>;
}