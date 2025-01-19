const User = require('../models/User');

exports.checkUserExists = async (user) => {
    try {
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            const newUser = new User({
                sub: user.sub,
                email: user.email,
                name: user.name,
                picture: user.picture,
                updated_at: user.updated_at
            });
            await newUser.save();
            console.log('New user saved to the database');
        } else {
            console.log('User already exists in the database');
        }
    } catch (error) {
        throw new Error('Error checking/adding user to the database');
    }
};
