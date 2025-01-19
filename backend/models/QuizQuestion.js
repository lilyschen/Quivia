const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  originalFlashcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard', required: true },
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  options: [{ type: String, required: true }],
  explanation: String,
  studySetId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudySet', required: true }
});

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

module.exports = QuizQuestion; 
