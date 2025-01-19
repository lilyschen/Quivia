require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { db } = require('./utils/config');

const flashcardRoutes = require('./routes/flashcardRoutes');
const userRoutes = require('./routes/userRoutes');
const studySetRoutes = require('./routes/studySetRoutes');

const app = express();

const corsOptions = {
    // origin: 'http://localhost:3001',
    origin: '*', // allow all origins
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(db.uri, {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.use('/', flashcardRoutes);
app.use('/', userRoutes);
app.use('/', studySetRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the YADA API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
