// Node JS Package
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

// Middleware d'authentification
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    }   catch {
        res.status(401).json({ 
            error: new Error('Invalid request !'),
        });
    }
};