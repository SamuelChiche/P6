const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('mongo-sanitize');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    const cleanEmail = sanitize(req.body.email);
    const cleanPassword = sanitize(req.body.password);
    bcrypt.hash(cleanPassword, 12)
        .then(hash => {
            const user = new User({
                email: cleanEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created !'}))
                .catch(error => {
                console.log(error);
                res.status(400).json({ error })});
        })
        .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    const cleanEmail = sanitize(req.body.email);
    const cleanPassword = sanitize(req.body.password);
    User.findOne({ email: cleanEmail })
        .then(user =>{
            if (!user){
                return res.status(401).json({ error : 'User not found !'})
            }
            bcrypt.compare(cleanPassword, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Incorrect password !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId : user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};