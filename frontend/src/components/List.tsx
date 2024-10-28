interface Props { 
    users: Array<{
        name: string;
        email: string;
        password: string;
    }>
}

const List = ({users}:Props) => {
    const renderList = (): JSX.Element[] => {
        return users.map(user => {
            return(
                <li key={user.email}>
                    <h1>{user.name} </h1>
                </li>
            )
        })
    }

    return (
        <ul>
            {renderList()}
        </ul>
    )
}

export default List