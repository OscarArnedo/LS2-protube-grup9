import { UserDTO as User } from '../types/userDTO';
import useNewUserForm from '../hooks/useNewUserForm';


interface FormProps {
    onSubmit: (newUser: User) => void
}

//Empezar el FORMSPROPS
const Form =({onSubmit}: FormProps) =>{
    const [inputValues, dispatch] = useNewUserForm()

    const handleSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        onSubmit(inputValues)
        dispatch({ type: 'clear' })
    }

    const handleChange = (evt:React.ChangeEvent<HTMLInputElement >)  => { 
        const{name,value} = evt.target

        dispatch({
            type: 'change_value',
            payload:{
                inputName: name,
                inputValue: value
            }
        })
    }

    const handleClear = () => {
        dispatch({ type: 'clear' })
    }

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    onChange={handleChange}
                    value={inputValues.name}
                    type="text"
                    name="name"
                    placeholder="Name"/>
                <input
                    className="input-field"
                    onChange={handleChange}
                    value={inputValues.email}
                    type="email"
                    name="email"
                    placeholder="Email"/>
                <input
                    className="input-field"
                    onChange={handleChange}
                    value={inputValues.password}
                    type="password"
                    name="password"
                    placeholder="Password"/>
                <div className="button-group">
                    <button className="button" onClick={handleClear} type="button">
                        Clear the form
                    </button>
                    <button className="button" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Form