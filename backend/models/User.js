// Node JS package
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schema utilisateur pour la base de données
const userSchema = mongoose.Schema({
    userId: { type: String },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);