const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauces');

router.get('/', saucesCtrl.getAllSauces);
router.get('/:id', saucesCtrl.getOneSauce);
router.post('/', saucesCtrl.createSauce);
router.put('/:id', saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauce);
router.post('/:id/like', saucesCtrl.likeSauce);

module.exports = router;
