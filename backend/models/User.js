const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sub: { type: String, required: true, unique: true }, // Auth0 user ID
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    updated_at: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
