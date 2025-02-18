const express = require("express");
const router = express.Router();
const studySetController = require("../controllers/studySetController");

router.post("/create-study-set", studySetController.createStudySet);
router.post(
  "/add-flashcard-to-study-set",
  studySetController.addFlashcardToStudySet
);
router.post("/fetch-study-sets", studySetController.fetchStudySets);
router.post("/view-study-set", studySetController.viewStudySet);
router.delete("/delete-study-set", studySetController.deleteStudySet);
router.put("/update-study-set-name", studySetController.updateStudySetName);

router.get("/study-set/:studySetId", studySetController.getStudySetById);

// study session routes
router.post("/start-study-session", studySetController.startStudySession);
router.put("/update-study-progress", studySetController.updateStudyProgress);
router.put("/complete-study-session", studySetController.completeStudySession);
router.get("/study-sessions", studySetController.getStudySessionsForSet);

router.post('/start-quiz-mode', studySetController.startQuizMode);
router.post('/submit-quiz-answer', studySetController.submitQuizAnswer);
router.get('/load-shared-quiz/:shareableId', studySetController.loadSharedQuiz);

module.exports = router;
