const fs = require('fs');
const Book = require('../models/Book');

// Create a new book if user is logged in
exports.create = (req, res) => {
    if(req.file) {
        const fileName = req.fileName;

        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject.userId;

        // if book creator doesn't rate it, this sets default value for ratings and average
        if(bookObject.ratings[0].grade === 0) {
            bookObject.ratings = [];
            bookObject.averageRating = 0;
        }
    
        // create an book info object
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

// Get top 3 rated books
exports.getBestRatings = (req, res) => {
    Book.find()
    .then(books => {
        // create a copy of the books array then sorts it by decreasing average rating
        let sortBooks = books.slice().sort((a,b) => b.averageRating - a.averageRating)

        let bestBooks = [];

        // push 3 best books
        for (let i=0; i<3; i++) {
            let bestBook = sortBooks[i];
            bestBooks.push(bestBook);
        }

        res.status(200).json(bestBooks)
    })
    .catch(error => res.status(400).json({error}))
}

// Get a book with its id
exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}))
}

// Rate a book if user is logged in
exports.rate = (req, res) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        // if book hasn't rate, push new rating else check if userId already exists
        if(book.ratings.length === 0) {
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
        } else {
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
        }
    })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}))
}

// Get all books saved in database
exports.getAll = (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}))
}

// Modify a book if user is the book's creator
exports.modify = (req, res) => {
    const fileName = req.fileName;

    // if file create an object else a string
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
            // remove old picture
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

// Remove a book if user is the book's creator
exports.delete = (req, res) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId !== req.auth.userId) {
            res.status(401).json({
                message: 'Unauthorized'
            })
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            // remove the picture
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