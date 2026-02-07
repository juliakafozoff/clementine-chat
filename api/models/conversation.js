const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    joined: {type: Date, require: false, default: Date.now()},
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

const Conversation = mongoose.model("Conversation", schema);

module.exports = Conversation;
