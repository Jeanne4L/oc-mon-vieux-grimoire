const fs = require('fs');
const Book = require('../models/Book');

exports.createBook = async (req, res) => {
    if(req.file) {
        const fileName = req.fileName;

        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject.userId;
    
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${fileName}`
        });
    
        book.save()
        .then(() => res.status(201).json({
            message: 'Book created'
        }))
        .catch(error => res.status(400).json({error}))
    }
}

exports.getBestRatings = (req, res) => {
    Book.find()
    .then(books => {

        let sortBooks = books.slice().sort((a,b) => b.averageRating - a.averageRating)

        let bestBooks = [];

        for (let i=0; i<3; i++) {
            let bestBook = sortBooks[i];
            bestBooks.push(bestBook);
        }

        res.status(200).json(bestBooks)
    })
    .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}))
}

exports.rateBook = (req, res) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        for(let i=0; i<book.ratings.length; i++) {
            if(req.auth.userId === book.ratings.userId) {
                res.status(403).json({
                    message: 'Unauthorized'
                })
            } else {
                book.ratings.push({
                    userId: req.auth.userId,
                    grade: req.body.rating
                })

                let totalRating = 0;
                for( let i=0; i<book.ratings.length; i++) {
                    let currentGrade = book.ratings[i].grade;
                    
                    totalRating += currentGrade;
                }
                book.averageRating = totalRating / book.ratings.length;
                return book.save();
            }
        }
    })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}))
}

exports.getAllBooks = (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}))
}

exports.modifyBook = (req, res) => {
    const fileName = req.fileName;

    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${fileName}`
    } : {...req.body};

    delete bookObject._userId;

    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId != req.auth.userId) {
            res.status(403).json({
                message: 'Unauthorized'
            })
        } else {
            const oldImage = book.imageUrl.split('/images/')[1];

            if (req.file && oldImage) {
                fs.unlink(`./images/${oldImage}`, error => {
                    if (error) {
                        console.error(error);
                    }
                })
            }

            Book.updateOne({_id: req.params.id}, {...bookObject, _id:req.params.id })
            .then(() => res.status(200).json({
                message: 'Book updated'
            }))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(404).json({error}))
}

exports.deleteBook = (req, res) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId !== req.auth.userId) {
            res.status(401).json({
                message: 'Unauthorized'
            })
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({
                    message: 'Book deleted'
                }))
                .catch(error => res.status(401).json({error}))
            })
        }
    })
    .catch(error => res.status(500).json({error}))
}