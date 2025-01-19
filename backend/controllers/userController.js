exports.createUser = (req, res) => {
    res.status(200).json({ message: 'User checked/created successfully' });
};

exports.getProfile = (req, res) => {
    res.send('Profile endpoint');
};
