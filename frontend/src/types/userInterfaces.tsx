export interface LoginResponse {
    token: string;
}

export interface RegisterDTO {
    name: string;
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