const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    date: {type: Date, require: true, default: Date.now()},
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const Message = mongoose.model("Message", schema);

module.exports = Message;
