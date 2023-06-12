const express = require('express');
// const mongoose = require('mongoose');
const path = require('path');

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// // database connection 
// mongoose.connect('mongodb+srv://jeanne4l:qvdB2wNFm4XCOGAB@monvieuxgrimoire.3jve4je.mongodb.net/?retryWrites=true&w=majority',
//     { useNewUrlParser: true,
//         useUnifiedTopology: true })
//     .then(() => console.log('Connexion à MongoDB réussie !'))
//     .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express()

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

// on exporte notre app (comme export default)
module.exports = app;