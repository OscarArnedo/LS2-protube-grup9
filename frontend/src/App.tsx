import './App.css';
//import Form from './components/Form';
import { /*useEffect,*/ useState, useRef } from 'react';
//import type { RegisterDTO } from './types/userInterfaces';
//import List from './components/List';
import {/*getAllUsers, */login} from './services/users';
import './index.css';
import Login from './components/Login';

//import { BrowserRouter, Routes,Route,Outlet,Link } from 'react-router-dom';

// interface AppState {
//   users: Array<RegisterDTO>
//   newUserNumber: number
// }

function App() {
  //const [newUserNumber, setNewUserNumber] = useState<AppState["newUserNumber"]>(0)
  const divRef = useRef<HTMLDivElement>(null)
  //const [users, setUsers] = useState<AppState["users"]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   getAllUsers().then(setUsers)
  // }, [])

  // const handleSubmit = (newuser: RegisterDTO):void => {
  //   setUsers(users =>[...users, newuser])
  //   setNewUserNumber(n => n + 1)
  // }

  const handleLogin = async (username: string, password: string) => {
    try {
        const response = await login(username, password);
        console.log('Login successful:', response);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
    } catch (error) {
        console.error('Login failed:', error);
    }
};

  return(
    <div className="App" ref={divRef}>
       <h1 className="text-2xl font-bold mb-4">Login</h1>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <h2>Welcome</h2>
      )}
    </div>
    // <div className="App" ref={divRef}>
    //   <h1>Login</h1>
    //   <List users={users} />
    //   New users: {newUserNumber}
    //   <Form onSubmit={handleSubmit} />
    // </div>

  );  
}


export default App;
