const sharp = require ('sharp')
const fs= require('fs');
const Book = require('../models/Book')

exports.createBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;

    const { buffer, originalname } = await req.file;
    const fileName = `${originalname}-${Date.now()}.webp`;

    // convert input image to webp
    sharp(buffer)
    .webp()
    .toFile("./images/" + fileName)
    .catch(function(err) {
        console.log(err)
    })

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${fileName}`
    });

    book.save()
    .then(() => res.status(201).json({
        message: 'Livre créé'
    }))
    .catch(error => res.status(400).json({error}))
}

exports.getOneBook = (req, res, next) => {
    console.log(req)

    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({error}))
}

exports.getBestRatings = (req, res, next) => {
    console.log(req)
    res.status(200)

    // Book.find()
    // .then(books => {

    //     // let sortBooks = books.slice().sort((a,b) => b.averageRating - a.averageRating)

    //     // let bestBooks = [];

    //     // for (let i=0; i<3; i++) {
    //     //     let bestBook = sortBooks[i];
    //     //     bestBooks.push(bestBook);
    //     // }

    //     res.status(200).json(bestBooks)
    //     // console.log(books)

    // })
    // .catch(error => res.status(400).json({error}))
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}))
}

exports.modifyBook = async (req, res, next) => {
    const originalname = await req.file;
    const fileName = `${originalname}-${Date.now()}.webp`;
    
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${fileName}`
    } : {...req.body};

    delete bookObject._userId;

    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId !== req.auth.userId) {
            res.status(401).json({
                message: 'Non autorisé'
            })
        } else {
            Book.updateOne({_id: req.params.id}, {...req.body, _id:req.params.id })
            .then(() => res.status(200).json({
                message: 'Livre modifié'
            }))
            .catch(error => res.status(400).json({error}))
        }
    })
    .catch(error => res.status(404).json({error}))
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book => {
        if(book.userId !== req.auth.userId) {
            res.status(401).json({
                message: 'Non autorisé'
            })
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`/images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({
                    message: 'Livre supprimé'
                }))
                .catch(error => res.status(401).json({error}))
            })
        }
    })
    .catch(error => res.status(500).json({error}))
}