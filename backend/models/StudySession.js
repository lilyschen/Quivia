const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
    studySet: { type: mongoose.Schema.Types.ObjectId, ref: 'StudySet', required: true },
    user: { type: String, required: true },
    progress: [
        {
            flashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard', required: true },
            status: { type: String, enum: ['correct', 'incorrect'], required: true },
            attempts: { type: Number, default: 1 }
        }
    ],
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

module.exports = StudySession;
