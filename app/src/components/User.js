import React, {useState} from 'react';
import conversationService from '../services/conversation';
import {swalInfo} from '../utils/swal';
import {connect} from "react-redux";
import keys from "../store/keys";
import {setKey, clearKeys, setStringifiedKey} from "../store/actions";
import { Redirect } from 'react-router';

function User({
    session,
    setKey,
    getKey,
    clearKeys,
    setStringifiedKey,
    ...props
}) {

    const [redirectTo, setRedirectTo] = useState(null);
    const handleStartChat = id => {
        if(!session.isLoggedIn) {
            setKey(keys.showLogin, true);
            return;
        }

        if (id === session.user._id) {
            swalInfo(`You cannot chat with yourself.`);
            return;
        }

        conversationService.create([
            id,
            session.user._id
        ]).then(result => {
            if (result.data) {
                setKey(keys.startConversation, result.data._id);
            }
        });

        setRedirectTo(`/chat`);
    }

    return (
        <div className="card user">
            {redirectTo && <Redirect to={redirectTo} />}
            {props.data.name} <br/>
            <button className="btn btn-sm btn-primary mt-10" onClick={e => handleStartChat(props.data._id)}>Start Chat</button>
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    clearKeys: () => dispatch(clearKeys()),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(User);