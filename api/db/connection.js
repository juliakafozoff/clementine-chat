const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    poolSize: 5,
    useUnifiedTopology: true
})
    .then(db => console.log('Connected with MongoDB.'))
    .catch(err => console.log(`Unable to connect with MongoDB: ${err.message}`));