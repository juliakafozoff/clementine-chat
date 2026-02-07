import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import {setKey} from "../store/actions";
import {connect} from "react-redux";
import conversationService from '../services/conversation';
import messageService from '../services/message';
import {
    ChatList,
    MessageList,
    Navbar
} from "react-chat-elements";
import {swalError} from '../utils/swal';
import noChatSelected from '../media/no-chat-selected.png';
import 'react-chat-elements/dist/main.css';
import keys from "../store/keys";

var socket = null;
function Chat({
                  session,
                  setKey,
                  ...props
              }) {

    const [messageText, setMessageText] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket = io(process.env.REACT_APP_API_URL, {transports: ['websocket']});
        socket.emit("init", session.user._id);
        socket.on('connect', () => {
            ("Connected to SocketIO Server.");
        });
        socket.on("message-received", () => {
            reloadConversationsAndMessages();
            scrollChat();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(session.startConversation && session.startConversation.length === 24) {
            setSelectedConversationId(session.startConversation);
            setKey(keys.startConversation, null);
        }
    }, [session.startConversation, setKey]);

    useEffect(() => {
        reloadConversations(keyword);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const reloadConversations = searchKeyword => {
        conversationService.getAll(session.user._id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                let f = [];
                const data = result.data;
                data.forEach(x => {
                    x.members.forEach(member => {
                        if (member._id !== session.user._id) {
                            f.push({
                                conversationId: x._id,
                                avatar: member.fileUrl,
                                alt: member.name,
                                title: member.name,
                                subtitle: x.subtitle,
                                date: new Date(x.recentDate),
                                unread: 0
                            });
                        }
                    });
                });

                if (f.length > 0 && searchKeyword && searchKeyword.length > 0)
                    f = f.filter(y => y && y.title && y.title.toLowerCase().includes(searchKeyword.toLowerCase()));

                setConversations(f);
            });
    }

    const reloadConversationsAndMessages = () => {
        conversationService.getAll(session.user._id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                let f = [];
                const data = result.data;
                data.forEach(x => {
                    x.members.forEach(member => {
                        if (member._id !== session.user._id) {
                            f.push({
                                conversationId: x._id,
                                title: member.name,
                                subtitle: x.subtitle,
                                date: new Date(x.recentDate),
                                unread: 0
                            });
                        }
                    });
                });

                setConversations(f);
                reloadMessagesByConversationId(f[0].conversationId);
            });
    }

    useEffect(() => {
        reloadMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedConversationId]);

    const reloadMessages = () => {
        if (selectedConversationId) {
            messageService.getAll(selectedConversationId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    let t = result.data;
                    t = t.map(x => {
                        return {
                            position: x.authorId === session.user._id ? 'right' : 'left',
                            type: 'text',
                            text: x.body,
                            date: new Date(x.date),
                        };
                    });
                    setMessages(t);
                });
        }
    }

    const reloadMessagesByConversationId = conversationId => {
        if (conversationId) {
            messageService.getAll(conversationId)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    let t = result.data;
                    t = t.map(x => {
                        return {
                            position: x.authorId === session.user._id ? 'right' : 'left',
                            type: 'text',
                            text: x.body,
                            date: new Date(x.date),
                        };
                    });
                    setMessages(t);
                });
        }
    }

    const handleKeyPress = e => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    }

    const handleSendMessage = () => {
        if (!messageText || !selectedConversationId) return;

        const data = {
            conversationId: selectedConversationId,
            date: Date.now(),
            authorId: session.user._id,
            body: messageText
        };

        socket.emit("new-message", data);
        reloadMessages();
        setMessageText("");
        reloadConversations();
    }

    const selectConversation = e => {
        setSelectedConversationId(e.conversationId);
        scrollChat();
    }

    const scrollChat = () => {
        setTimeout(() => {
            if(document.querySelector(`.rce-mlist`)) {
                const element = document.querySelector(`.rce-mlist`);
                element.scrollTop = element.scrollHeight - element.clientHeight;
            }

            if(document.getElementById('txt-new-message')) {
                document.getElementById('txt-new-message').focus();
            }
        }, 300);
    }

    const renderChatNavbar = () => {
        if (selectedConversationId) {
            let c = conversations.find(c => c.conversationId === selectedConversationId);
            if (c) {
                return <Navbar left={<p className="navBarText">{c.title}</p>} />;
            }
        }
    }

    return (
        <div className="container chat">
            <div className="row mt-20">
                <div className="col-sm-4 left-side">
                    <div className="row">
                        <input
                            type="text"
                            className="form-control txt-filter-conversations"
                            placeholder="Filter conversations..."
                            value={keyword} onChange={e => setKeyword(e.target.value)}/>
                    </div>
                    <div className="row users">
                        <ChatList
                            className='chat-list'
                            dataSource={conversations}
                            onClick={selectConversation}/>
                    </div>
                </div>
                <div className="col-sm-8 right-side">
                    <div className="row">
                        <div className="col">
                            {renderChatNavbar()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            {
                                !selectedConversationId || messages.length === 0 ?
                                    <img src={noChatSelected} className="no-chat-selected" alt="No chat selected" /> :
                                    <MessageList
                                        className="message-list"
                                        lockable={true}
                                        toBottomHeight={"100%"}
                                        dataSource={messages}
                                    />
                            }
                        </div>
                    </div>

                    {
                        selectedConversationId &&
                        <div className="row">
                            <div className="col">
                            <div className="form-inline">
                                <input
                                    type="text"
                                    className="form-control txt-new-message"
                                    placeholder="Type your message..."
                                    value={messageText}
                                    onChange={e => setMessageText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    id="txt-new-message"
                                    autoFocus
                                    style={{width: '90%'}}/>
                                <button className="btn btn-primary btn-send" onClick={handleSendMessage}>Send</button>
                            </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = store => ({session: store.session});
const mapDispatchToProps = dispatch => ({setKey: (key, value) => dispatch(setKey(key, value))});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);