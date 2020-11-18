const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

const multer = require('../middleware/multer-config');

router.get('/', saucesCtrl.getAllSauces);
router.post('/', multer, saucesCtrl.createSauce);
router.get('/:id', saucesCtrl.getOneSauce);
router.put('/:id', saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauce);


module.exports = router;
