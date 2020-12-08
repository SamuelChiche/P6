// Node JS package
const express = require('express');
const router = express.Router();

// Auth Controllers
const authCtrl = require('../controllers/auth');

// Routes
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;
