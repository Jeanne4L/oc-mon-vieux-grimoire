const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRatings);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;