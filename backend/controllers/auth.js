// Node JS package
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const dotenv = require('dotenv').config();

//User model
const User = require('../models/User');


// Inscription
exports.signup = (req, res, next) => {
    const cleanEmail = sanitize(req.body.email);
    const cleanPassword = sanitize(req.body.password);
    // Encryptage du mot de passe
    bcrypt.hash(cleanPassword, 12)
        .then(hash => {
            // Création du nouvel utilisateur
            const user = new User({
                email: cleanEmail,
                password: hash
            });
            // Sauvegarde dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'User created !'}))
                .catch(error => {
                console.log(error);
                res.status(400).json({ error })});
        })
        .catch(error => res.status(400).json({ error }));
};

// Connexion
exports.login = (req, res, next) => {
    const cleanEmail = sanitize(req.body.email);
    const cleanPassword = sanitize(req.body.password);
    // Récupération du profil de l'utilisateur
    User.findOne({ email: cleanEmail })
        .then(user =>{
            if (!user){
                return res.status(401).json({ error : 'User not found !'})
            }
            // Comparaison avec la base de données
            bcrypt.compare(cleanPassword, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect password !' })
                    }
                    // Connexion de l'utilisateur avec un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId : user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};