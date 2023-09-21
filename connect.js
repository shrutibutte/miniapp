// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
const originalcollection = db.collection('original');
const syntheticcollection = db.collection('synthetic');
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = { db, originalcollection, syntheticcollection }
