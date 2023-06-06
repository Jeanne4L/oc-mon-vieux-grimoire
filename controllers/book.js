const sharp = require ('sharp')
const Book = require('../models/Book')

exports.createBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;

    const { buffer, originalname } = await req.file;
    const ref = `${originalname}-${Date.now()}.webp`;
    // const ref = `${Date.now()}-boofdoadni.webp`

    console.log(req.file)
    // await sharp(buffer)
    //   .webp({ quality: 80 })
    //   .toFile("./images/" + ref);
    // const link = `${req.protocol}://${req.get('host')}/images/${ref}`;

    sharp(buffer)
    .webp()
    .toFile("./images/" + ref)
    .then(function(info) {
        console.log(info)
    })
    .catch(function(err) {
        console.log(err)
    })

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        // imageUrl: link
        // imageUrl: ` ${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        imageUrl: ` ${req.protocol}://${req.get('host')}/images/${ref}`
    });

    book.save()
    .then(() => res.status(201).json({
        message: 'Livre créé'
    }))
    .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}))
}

// exports.getBestRatings = (req, res, next) => {
    
// }

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(201).json(books))
    .catch(error => res.status(400).json({error}))
}