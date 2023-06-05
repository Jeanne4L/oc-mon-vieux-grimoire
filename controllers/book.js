const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: ` ${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(201).json(books))
    .catch(error => res.status(400).json({error}))
}