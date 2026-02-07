const mongoose = require("mongoose");
const {isEmail} = require('validator');

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 50
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        validate: isEmail
    },
    password: {
        type: String,
        require: true,
        minlength: 3
    }
});

const User = mongoose.model("User", schema);

module.exports = User;
