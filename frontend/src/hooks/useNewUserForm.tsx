import { useReducer } from "react"
import { RegisterDTO as User } from "../types/userInterfaces"

interface FormState {
    inputValues: User
}

type FormReducerAction ={
    type: 'change_value' ,
    payload: {
        inputName: string,
        inputValue: string
    }
} | {
    type: 'clear'
}

const INITIAL_STATE = {
    name: '',
    email: '',
    password: ''
}

const formReducer = (state:FormState["inputValues"], action:
    FormReducerAction) => {
    switch(action.type){
        case "change_value":
           const {inputName, inputValue} = action.payload
            return {
            ...state,
            [inputName]: inputValue
            }
        case "clear":
            return INITIAL_STATE
        default:
            return state
    }
}

const useNewUserForm = () => {
    return useReducer(formReducer, INITIAL_STATE)
    
}

export default useNewUserForm