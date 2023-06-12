const sharp = require('sharp');

module.exports = async (req, res, next) => {
    let fileName;

    if (req.file) {
        const { buffer, originalname } = req.file;
        fileName = `${originalname}-${Date.now()}.webp`;

        // convert input image to webp
        await sharp(buffer)
        .webp()
        .toFile("./images/" + fileName)
        .catch(function(error) {
            console.log(error)
        });
    }

    req.fileName = fileName; 
    next();
}