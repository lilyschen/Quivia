const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const upload = require('../middleware/uploadMiddleware');

router.post('/generate-flashcards', upload.single('pdf'), flashcardController.generateFlashcards);
router.post('/save-flashcard', flashcardController.saveFlashcard);
router.post('/flashcards', flashcardController.getFlashcards);
router.post('/fetch-flashcards', flashcardController.fetchFlashcards);
router.delete('/delete-flashcard', flashcardController.deleteFlashcard);
router.put('/edit-flashcard', flashcardController.editFlashcard);
router.post('/create-flashcard', flashcardController.createFlashcard);

module.exports = router;
