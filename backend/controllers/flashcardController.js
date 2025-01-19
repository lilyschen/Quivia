const FlashcardService = require('../services/flashcardService');

exports.generateFlashcards = async (req, res) => {
    const result = await FlashcardService.generateFlashcards(req);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    return res.json(result);
};

exports.saveFlashcard = async (req, res) => {
    const result = await FlashcardService.saveFlashcard(req);
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.getFlashcards = async (req, res) => {
    try {
        const flashcards = await FlashcardService.getFlashcards(req);
        res.json(flashcards);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.fetchFlashcards = async (req, res) => {
    try {
        const flashcards = await FlashcardService.fetchFlashcards(req);
        res.json(flashcards);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteFlashcard = async (req, res) => {
    const result = await FlashcardService.deleteFlashcard(req);
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.editFlashcard = async (req, res) => {
    const result = await FlashcardService.editFlashcard(req);
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result);
};

exports.createFlashcard = async (req, res) => {
    const result = await FlashcardService.createFlashcard(req);
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result);
};
