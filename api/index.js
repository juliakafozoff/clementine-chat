require('./db/connection');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const users = require('./routes/user');
const conversations = require('./routes/conversation');
const messages = require('./routes/message');
const messageManager = require('./managers/message');
const conversationManager = require('./managers/conversation');

const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(200).send("API is working..."));
app.use('/users', users);
app.use('/conversations', conversations);
app.use('/messages', messages);

const clients = [];
io.on("connection", client => {
    // console.log("connection: ", client.id);

    client.on("init", async userId => {
        // console.log("init: ", userId);
        client.userId = userId;
        if (clients[userId]) {
            clients[userId].push(client);
        } else {
            clients[userId] = [client];
        }
    });

    client.on("new-message", async data => {
        await messageManager.create(data);
            const conversationMembers = await conversationManager.getMembersById(data.conversationId);
            conversationMembers.forEach(member => {
                member = member.toString();
               if(member !== data.authorId.toString()) {
                   if(clients[member]) {
                       clients[member].forEach(cli => {
                           cli.emit("message-received");
                       });
                   }
               }
            });
    });

    client.on('disconnect', () => {
        if (!client.userId || !clients[client.userId]) return;

        let targetClients = clients[client.userId];
        for (let i = 0; i < targetClients.length; ++i) {
            if(targetClients[i]) {
                if (targetClients[i] == client) {
                    targetClients.splice(i, 1);
                }
            }
        }
        // console.log("disconnected!!! ", client.id);
    });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server listening on port ${port}`));