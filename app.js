// app.js
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT
const { originalcollection, syntheticcollection, db } = require('./connect'); // Import the MongoDB connection file
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
app.use(cors());


// Middleware
app.use(bodyParser.json());

// Routes

const storage = multer.memoryStorage();
const upload = multer({ storage });



app.post('/get_origanaldata', async (req, res) => {
    try {
        const data = req.body;
        const page = data.limit + 1 || 5;
        const itemsPerPage = data.rowperpage || 10;
        const totalDocuments = await originalcollection.countDocuments({});

        const skip = (page - 1) * itemsPerPage;
        const documents = await originalcollection.find({}).skip(skip).limit(itemsPerPage).toArray();

        const datas = documents.map((document) => {
            const { _id, ...data } = document;
            return data;
        });

        res.json({ data: datas, size: totalDocuments });
    } catch (error) {
        console.error(error);
        res.json({ data: [], size: 0 });
    }
});


app.post('/get_syntheticdata', async (req, res) => {
    try {
        const data = req.body;

        const page = data.limit + 1 || 5;
        const itemsPerPage = data.rowperpage || 10;

        const totalDocuments = await syntheticcollection.countDocuments({});
        const skip = (page - 1) * itemsPerPage;
        const documents = await syntheticcollection.find({}).skip(skip).limit(itemsPerPage).toArray();

        const datas = documents.map((document) => {
            const { _id, ...data } = document;
            return data;
        });

        res.json({ data: datas, size: totalDocuments });
    } catch (error) {
        console.error(error);
        res.json({ data: [], size: 0 });
    }
});


app.post('/upload_original', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const jsonData = JSON.parse(fileBuffer.toString('utf8'));
        // Insert JSON data into MongoDB
        const result = await originalcollection.insertMany(jsonData);
        console.log(`Inserted ${result.insertedCount} documents`);
        res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (err) {
        console.error('Error uploading data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/upload_synthetic', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const jsonData = JSON.parse(fileBuffer.toString('utf8'));
        // Insert JSON data into MongoDB

        const result = await syntheticcollection.insertMany(jsonData);
        console.log(`Inserted ${result.insertedCount} documents`);
        res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (err) {
        console.error('Error uploading data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
console.log('Starting the server...', port);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

