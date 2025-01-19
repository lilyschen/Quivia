const QuizQuestion = require('../models/QuizQuestion');
const GameSession = require('../models/GameSession');
const StudySet = require('../models/StudySet');
const crypto = require('crypto');

exports.generateQuizQuestions = async (studySetId) => {
  const studySet = await StudySet.findById(studySetId).populate('flashcards');
  if (!studySet) {
    throw new Error('Study set not found');
  }

  const questions = [];
  const flashcards = studySet.flashcards;

  for (const flashcard of flashcards) {
    // Get 3 random incorrect answers from other flashcards
    const otherAnswers = flashcards
      .filter(f => f._id.toString() !== flashcard._id.toString())
      .map(f => f.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...otherAnswers, flashcard.answer]
      .sort(() => 0.5 - Math.random());

    const quizQuestion = new QuizQuestion({
      originalFlashcard: flashcard._id,
      question: flashcard.question,
      correctAnswer: flashcard.answer,
      options,
      studySetId,
      explanation: `The correct answer is: ${flashcard.answer}`
    });
    
    await quizQuestion.save();
    questions.push(quizQuestion);
  }

  return questions;
};

exports.startQuizMode = async (studySetId, userId) => {
  // Generate quiz questions if they don't exist for this study set
  let questions = await QuizQuestion.find({ studySetId });
  if (questions.length === 0) {
    questions = await this.generateQuizQuestions(studySetId);
  }

  const shareableId = crypto.randomBytes(8).toString('hex');

  const gameSession = new GameSession({
    studySet: studySetId,
    user: userId,
    mode: 'quiz',
    mode_type: 'QuizQuestion',
    progress: questions.map(q => ({
      item: q._id,
      status: 'incorrect',
      attempts: 0
    })),
    shareableId
  });

  await gameSession.save();
  return { gameSession, questions };
};