import React, {useState, useEffect} from 'react';
import userService from '../services/user';
import User from './User';

function Home(props) {

    const [users, setUsers] = useState(null);

    useEffect(() => {
        
        userService.getAll(``)
        .then(result => {
            setUsers(result.data)
        });

    }, []);

    const renderUsers = () => {
        if(!users) return;

        return users.map(u => <User data={u} />);
    }

    return (
        <div className="container">
            <div className="row mt-20">
                <ul>
                {renderUsers()}
                </ul>
            </div>
        </div>
    );
}

export default Home;