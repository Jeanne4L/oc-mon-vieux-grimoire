const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// checks that the user's email doesn't exists in the database
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);