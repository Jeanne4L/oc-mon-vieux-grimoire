const multer = require('multer');

// temporarily saves images to be able to manipulate them
const storage = multer.memoryStorage();

module.exports = multer({storage}).single('image');