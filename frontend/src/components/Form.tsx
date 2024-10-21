const Form =() =>{
    const handleSubmit = () => {}
    
    return(
        <div>   
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" />
                <label>Password</label>
                <input type="password" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Form