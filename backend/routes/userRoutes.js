const express = require('express');
const router = express.Router();
const { checkUserExistsMiddleware } = require('../middleware/userMiddleware');
const userController = require('../controllers/userController');

router.post('/create-user', checkUserExistsMiddleware, userController.createUser);
router.get('/profile', userController.getProfile);

module.exports = router;
