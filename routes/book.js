const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const imgProcessing = require('../middleware/sharp-imgProcessing');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAll);
router.get('/bestrating', bookCtrl.getBestRatings);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, imgProcessing, bookCtrl.create);
router.post('/:id/rating', auth, bookCtrl.rate);
router.put('/:id', auth, multer, imgProcessing, bookCtrl.modify);
router.delete('/:id', auth, bookCtrl.delete);


module.exports = router;