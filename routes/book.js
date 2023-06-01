const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    const books = [
        {
            _id: '0',
            userId: 'oeihfzeoi',
            title: 'Le petit chien',
            author: 'Marc Grillon',
            imageUrl: 'https://img.freepik.com/psd-gratuit/livre-maquette-couverture-rigide-trois-vues_125540-226.jpg?w=900&t=st=1685541504~exp=1685542104~hmac=775d73bd6d301ff523dc2bb1e746a1aefd3929b406906b3058d47e3e0e192ed8',
            year: 2020,
            genre: 'enfant',
            ratings: [
                {
                    userId: 'nverehthn',
                    grade: 4
                },
                {
                    userId: 'nklfmzle',
                    grade: 5
                }
            ],
            averageRating: 4.5
        },
        {
            _id: '1',
            userId: 'nklfmzle',
            title: 'Meutre à Alcatraz',
            author: 'Georgina Sam',
            imageUrl: 'https://img.freepik.com/psd-gratuit/maquette-livre-relie_125540-225.jpg?w=900&t=st=1685541471~exp=1685542071~hmac=25acc21b82deefc1273cbddce479fd4bf2656ea5b684180c2402ea0052d24180',
            year: 2022,
            genre: 'policier',
            ratings: [
                {
                    userId: 'vedbverbj',
                    grade: 3
                },
                {
                    userId: 'ngekrlggh',
                    grade: 5
                }
            ],
            averageRating: 4
        }
    ];
    res.status(200).json(books);
});

module.exports = router;