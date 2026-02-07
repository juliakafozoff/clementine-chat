import React from 'react';
import {Link} from 'react-router-dom';

function Footer(props) {
    return (
        <div className="fixed-bottom">
            <div style={{
                width: '100%'
            }}></div>
            <div className="footer">
                <div className="row text-center" style={{marginRight: '0px', marginLeft: '0px'}}>
                    <div className="col">
                        <p>© 2021 Copyright <Link to="/"> MERN SocketIO Chat</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;