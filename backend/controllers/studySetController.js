const StudySession = require("../models/StudySession");
const Flashcard = require("../models/Flashcard");
const StudySetService = require("../services/studySetService");

exports.createStudySet = async (req, res) => {
  const result = await StudySetService.createStudySet(req);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(200).json(result);
};

exports.addFlashcardToStudySet = async (req, res) => {
  const result = await StudySetService.addFlashcardToStudySet(req);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  return res.status(200).json(result);
};

exports.fetchStudySets = async (req, res) => {
  try {
    const studySets = await StudySetService.fetchStudySets(req);
    res.status(200).json(studySets);
  } catch (error) {
    console.error("Error fetching study sets:", error);
    res.status(500).json({ error: "Error fetching study sets" });
  }
};

exports.viewStudySet = async (req, res) => {
  const result = await StudySetService.viewStudySet(req);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  return res.status(200).json(result);
};

exports.deleteStudySet = async (req, res) => {
  const result = await StudySetService.deleteStudySet(req);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  return res.status(200).json(result);
};

exports.getStudySetById = async (req, res) => {
  try {
    const { studySetId } = req.params;
    const studySet = await StudySetService.getStudySetById(studySetId);
    if (!studySet) {
      return res.status(404).json({ error: "Study set not found" });
    }
    res.json({ name: studySet.name, flashcards: studySet.flashcards });
  } catch (error) {
    console.error("Error fetching study set:", error);
    res.status(500).json({ error: "Error fetching study set" });
  }
};

exports.updateStudySetName = async (req, res) => {
  const result = await StudySetService.updateStudySetName(req);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(200).json(result);
};

exports.startStudySession = async (req, res) => {
  const { studySetId, user } = req.body;
  const studySet = await StudySetService.getStudySetById(studySetId);
  if (!studySet) {
    return res.status(404).json({ error: "Study set not found" });
  }

  const studySession = new StudySession({
    studySet: studySetId,
    user: user.sub,
    progress: studySet.flashcards.map((flashcard) => ({
      flashcard: flashcard._id,
      status: "incorrect",
      attempts: 0,
    })),
    completed: false,
  });

  await studySession.save();
  return res
    .status(200)
    .json({ message: "Study session started successfully", studySession });
};

exports.updateStudyProgress = async (req, res) => {
  const { studySessionId, flashcardId, status } = req.body;

  const studySession = await StudySession.findById(studySessionId);
  if (!studySession) {
    return res.status(404).json({ error: "Study session not found" });
  }

  const progressEntry = studySession.progress.find(
    (entry) => entry.flashcard.toString() === flashcardId
  );
  if (!progressEntry) {
    return res
      .status(404)
      .json({ error: "Flashcard not found in study session" });
  }

  progressEntry.status = status;
  progressEntry.attempts += 1;
  studySession.updatedAt = Date.now();

  await studySession.save();
  return res
    .status(200)
    .json({ message: "Study progress updated successfully", studySession });
};

exports.completeStudySession = async (req, res) => {
  const { studySessionId } = req.body;

  const studySession = await StudySession.findById(studySessionId);
  if (!studySession) {
    return res.status(404).json({ error: "Study session not found" });
  }

  studySession.completed = true;
  studySession.updatedAt = Date.now();

  const correctCount = studySession.progress.filter(
    (entry) => entry.status === "correct"
  ).length;
  const totalCount = studySession.progress.length;

  await studySession.save();
  return res.status(200).json({
    message: "Study session completed successfully",
    correctCount,
    totalCount,
    studySession,
  });
};

exports.getStudySessionsForSet = async (req, res) => {
  const { studySetId, user } = req.body;
  const userId = user.sub;

  const studySessions = await StudySession.find({
    studySet: studySetId,
    user: userId,
  })
    .populate("studySet")
    .populate("progress.flashcard")
    .sort({ updatedAt: -1 });

  if (!studySessions.length) {
    return res.status(404).json({ error: "No study sessions found" });
  }

  return res
    .status(200)
    .json({ message: "Study sessions retrieved successfully", studySessions });
};

exports.startQuizMode = async (req, res) => {
  try {
    const { studySetId, user } = req.body;
    
    // Validate inputs
    if (!studySetId || !user?.sub) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const quizService = require('../services/quizService');
    const result = await quizService.startQuizMode(studySetId, user.sub);
    
    // Transform the response to match frontend expectations
    res.status(200).json({
      gameSession: result.gameSession._id,
      questions: result.questions.map(q => ({
        id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      })),
      shareableId: result.gameSession.shareableId,
    });
  } catch (error) {
    console.error('Error starting quiz mode:', error);
    res.status(400).json({ error: error.message || 'Failed to start quiz' });
  }
};

exports.submitQuizAnswer = async (req, res) => {
  try {
    const { gameSessionId, questionId, answer } = req.body;
    const quizService = require('../services/quizService');
    const result = await quizService.submitAnswer(gameSessionId, questionId, answer);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error submitting quiz answer:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.loadSharedQuiz = async (req, res) => {
  try {
    const { shareableId } = req.params;
    const quizService = require('../services/quizService');
    const result = await quizService.loadSharedQuiz(shareableId);
    
    // No need for user authentication check for shared quizzes
    res.status(200).json({
      gameSession: result.gameSession,  // Send full session object
      questions: result.questions.map(q => ({
        id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer  // Include correct answer for client-side checking
      })),
    });
  } catch (error) {
    console.error('Error loading shared quiz:', error);
    res.status(404).json({ error: error.message || 'Quiz not found' });
  }
};