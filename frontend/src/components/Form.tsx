import {useState } from 'react';
import { UserDTO } from '../types/userDTO';


interface FormState {
    inputValues: UserDTO
}

//Empezar el FORMSPROPS
const Form =() =>{
    const [inputValues, setInputValues] = useState<FormState["inputValues"]>({ 
        username: '',
        password: ''
    })

    const handleSubmit = () => {}

    const handleChange = (evt:React.ChangeEvent<HTMLInputElement>)  => { 
        setInputValues({
            ...inputValues,
            [evt.target.name]: evt.target.value
        })
    }

    return(
        <div>   
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} value={inputValues.username} type="text" name='username' placeholder='Name'/>
                <input onChange={handleChange} value={inputValues.password} type="password" name='password' placeholder='password'/>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default Form