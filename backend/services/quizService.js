const QuizQuestion = require('../models/QuizQuestion');
const GameSession = require('../models/GameSession');
const StudySet = require('../models/StudySet');
const crypto = require('crypto');

exports.generateQuizQuestions = async (studySetId) => {
  const studySet = await StudySet.findById(studySetId).populate('flashcards');
  if (!studySet) {
    throw new Error('Study set not found');
  }

  if (!studySet.flashcards || studySet.flashcards.length === 0) {
    throw new Error('Study set has no flashcards');
  }

  // Delete any existing questions for this study set
  await QuizQuestion.deleteMany({ studySetId });

  const questions = [];
  const flashcards = studySet.flashcards;

  for (const flashcard of flashcards) {
    // Ensure we have enough flashcards for options
    if (flashcards.length < 4) {
      throw new Error('Not enough flashcards to generate quiz questions (minimum 4 required)');
    }

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
    
    try {
      await quizQuestion.save();
      questions.push(quizQuestion);
    } catch (error) {
      console.error('Error saving quiz question:', error);
      throw new Error('Failed to save quiz question');
    }
  }

  return questions;
};

exports.startQuizMode = async (studySetId, userId) => {
    if (!studySetId || !userId) {
      throw new Error('Study set ID and user ID are required');
    }
  
    // Check if study set exists
    const studySet = await StudySet.findById(studySetId);
    if (!studySet) {
      throw new Error('Study set not found');
    }
  
    // Generate or get existing quiz questions
    let questions = await QuizQuestion.find({ studySetId });
    
    if (questions.length === 0) {
      questions = await this.generateQuizQuestions(studySetId);
    }
  
    if (!questions || questions.length === 0) {
      throw new Error('Failed to generate quiz questions');
    }
  
    // Create a shareable ID
    const shareableId = crypto.randomBytes(8).toString('hex');
  
    // Create new game session
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
      shareableId,
      completed: false,
      score: 0
    });
  
    try {
      await gameSession.save();
    } catch (error) {
      console.error('Error saving game session:', error);
      throw new Error('Failed to create game session');
    }
  
    // Return the shareableId along with gameSession and questions
    return {
        gameSession,
        questions,
        shareableId: gameSession.shareableId
      };
  };

exports.submitAnswer = async (gameSessionId, questionId, answer) => {
  const gameSession = await GameSession.findById(gameSessionId);
  if (!gameSession) {
    throw new Error('Game session not found');
  }

  const question = await QuizQuestion.findById(questionId);
  if (!question) {
    throw new Error('Question not found');
  }

  const progressEntry = gameSession.progress.find(
    p => p.item.toString() === questionId
  );

  if (!progressEntry) {
    throw new Error('Question not found in game session');
  }

  const isCorrect = answer === question.correctAnswer;
  progressEntry.status = isCorrect ? 'correct' : 'incorrect';
  progressEntry.attempts += 1;

  // Update score
  if (isCorrect) {
    gameSession.score += 1;
  }

  // Check if all questions are answered
  const allAnswered = gameSession.progress.every(p => p.attempts > 0);
  if (allAnswered) {
    gameSession.completed = true;
  }

  await gameSession.save();

  return {
    correct: isCorrect,
    explanation: question.explanation,
    completed: gameSession.completed,
    score: gameSession.score
  };
};

// In quizService.js
exports.loadSharedQuiz = async (shareableId) => {
  const gameSession = await GameSession.findOne({ shareableId })
    .populate('studySet');
    
  if (!gameSession) {
    throw new Error('Quiz not found');
  }

  const questions = await QuizQuestion.find({ studySetId: gameSession.studySet._id });
  
  return {
    gameSession,
    questions
  };
};