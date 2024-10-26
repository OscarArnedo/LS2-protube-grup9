export interface UserDTO {
    name: string;
    email: string;
    password: string;
}

export type UsersResponseFromAPI = Array<{
    name: string;
    email: string;
    password: string;
}>