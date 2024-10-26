import './App.css';
import Form from './components/Form';
import { useEffect, useState, useRef } from 'react';
import type { UserDTO } from './types/userDTO';
import List from './components/List';
import {getAllUsers} from './services/getAllUsers';
import './index.css';

//import { BrowserRouter, Routes,Route,Outlet,Link } from 'react-router-dom';

interface AppState {
  users: Array<UserDTO>
  newUserNumber: number
}

function App() {
  const [newUserNumber, setNewUserNumber] = useState<AppState["newUserNumber"]>(0)
  const divRef = useRef<HTMLDivElement>(null)

  const [users, setUsers] = useState<AppState["users"]>([])
  useEffect(() => {
    getAllUsers().then(setUsers)
  }, [])

  const handleSubmit = (newuser: UserDTO):void => {
    setUsers(users =>[...users, newuser])
    setNewUserNumber(n => n + 1)
  }

  return(
    <div className="App" ref={divRef}>
      <h1>Login</h1>
      <List users={users} />
      New users: {newUserNumber}
      <Form onSubmit={handleSubmit} />
    </div>
  );  
}


export default App;
