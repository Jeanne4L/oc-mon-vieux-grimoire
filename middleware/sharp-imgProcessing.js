const sharp = require('sharp');

module.exports = async (req, res, next) => {
    let fileName;

    if (req.file) {
        const { buffer, originalname } = req.file;
        fileName = `${originalname}-${Date.now()}.webp`;

        // resizes input image and converts it to webp 
        await sharp(buffer)
        .resize({
            width: 600,
            height: 600,
            fit: 'cover'
        })
        .webp()
        .toFile("./images/" + fileName)
        .catch(function(error) {
            console.log(error)
        });
    } 

    req.fileName = fileName; 
    next();
}