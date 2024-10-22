import './App.css';
import Form from './components/Form';
import { useState } from 'react';
import type { UserDTO } from './types/userDTO';

//import { BrowserRouter, Routes,Route,Outlet,Link } from 'react-router-dom';

interface AppState {
  users: Array<UserDTO>
  newUser: number
}

const INITIAL_STATE =[
  {id: 1, username: 'admin', password: 'admin'},
  {id: 2, username: 'user', password: 'user'}
]

function App() {
  const [user, setUser] = useState<Array<UserDTO>>(INITIAL_STATE);
  return(
    <div>
      <h1>Login</h1>
      <Form />
    </div>
  );

  /*return (<BrowserRouter>
    <Routes>
      <Route path='/' element={<Form />} />
      </Routes>
  </BrowserRouter>
  );*/
  
}


export default App;
