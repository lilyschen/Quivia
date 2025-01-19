const { checkUserExists } = require('../services/userService');

exports.checkUserExistsMiddleware = async (req, res, next) => {
    if (req.body.user) {
        try {
            await checkUserExists(req.body.user);
            next();
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(400).json({ error: 'User information is missing' });
    }
};
