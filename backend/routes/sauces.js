// Node JS Package
const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

// Auth middleware
const auth = require('../middleware/auth');

// Sauces controllers
const saucesCtrl = require('../controllers/sauces');

// Routes avec authentifications
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);


module.exports = router;
