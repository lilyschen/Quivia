const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    studySet: { type: mongoose.Schema.Types.ObjectId, ref: 'StudySet', required: true },
    user: { type: String, required: true },
    mode: { type: String, enum: ['flashcard', 'quiz'], required: true },
    progress: [{
      item: { type: mongoose.Schema.Types.ObjectId, refPath: 'mode_type' },
      status: { type: String, enum: ['correct', 'incorrect'], required: true },
      attempts: { type: Number, default: 0 }
    }],
    mode_type: { 
      type: String, 
      required: true,
      enum: ['Flashcard', 'QuizQuestion'],
      default: 'Flashcard'
    },
    score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    shareableId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  const GameSession = mongoose.model('GameSession', gameSessionSchema);

  module.exports = GameSession; 