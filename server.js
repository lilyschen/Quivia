const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Add axios for making HTTP requests
require('dotenv').config(); // Add dotenv to load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(fileUpload({
    createParentPath: true // Ensure parent directories are created if they do not exist
}));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get('/', (req, res) => {
    console.log('Serving index.html'); // Log serving index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the HTML file
});

app.post('/upload', async (req, res) => {
    console.log('Received upload request'); // Log the request

    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.'); // Log no files error
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const notesFile = req.files.notesFile;
    const uploadPath = path.join(__dirname, 'uploads', notesFile.name);

    notesFile.mv(uploadPath, async (err) => {
        if (err) {
            console.log('Error moving file:', err); // Log file move error
            return res.status(500).json({ error: 'Error moving file' });
        }

        console.log('File uploaded to', uploadPath); // Log successful file upload

        try {
            const questions = await generateQuestionsFromNotes(uploadPath);
            console.log('Generated questions:', questions); // Log generated questions
            res.json(questions);
        } catch (error) {
            console.log('Error generating questions:', error); // Log error in question generation
            res.status(500).json({ error: error.message });
        }
    });
});

async function generateQuestionsFromNotes(filePath) {
    console.log('Reading file:', filePath); // Log file read
    let notes;
    try {
        notes = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.log('Error reading file:', error); // Log file read error
        return { error: 'Error reading file' };
    }
    console.log('File content:', notes); // Log file content

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Generate questions from the following notes.' },
                { role: 'user', content: notes }
            ],
            max_tokens: 150,
            n: 5,
            stop: ['\n']
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API response:', response.data); // Log API response
        return response.data.choices.map(choice => ({
            question: choice.message.content.trim(),
            options: [] // You can add logic to generate options if needed
        }));
    } catch (error) {
        console.log('Error calling API:', error.response ? error.response.data : error.message); // Log API call error
        if (error.response) {
            console.log('Error details:', error.response.data); // Log detailed error response
        }
        throw new Error(error.response ? error.response.data.error.message : error.message);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
