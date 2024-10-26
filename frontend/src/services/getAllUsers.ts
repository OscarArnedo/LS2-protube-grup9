import axios from 'axios'
import type { UserDTO,UsersResponseFromAPI } from '../types/userDTO'

export const getAllUsers = () => {
    return fetchUsers().then(mapFromApiToUsers)
}

const fetchUsers = async ():Promise<UsersResponseFromAPI> => {
    const response = await axios
      .get<UsersResponseFromAPI>('https:localhost:3000/users')
      return response.data
  }

const mapFromApiToUsers = (apiResponse: UsersResponseFromAPI): 
  Array<UserDTO> => {
    return apiResponse.map(userFromApi => {
      const { 
        name, 
        email, 
        password } = userFromApi
      
      return {
        name,
        email,
        password
      } 
    })
  }