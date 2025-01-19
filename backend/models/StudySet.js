const mongoose = require('mongoose');

const studySetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' }]
});

const StudySet = mongoose.model('StudySet', studySetSchema);

module.exports = StudySet;
