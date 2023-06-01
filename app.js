const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/book');

// database connection 
mongoose.connect('mongodb+srv://jeanne4l:qvdB2wNFm4XCOGAB@monvieuxgrimoire.3jve4je.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// permettra de créer notre application
const app = express()

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('api/auth/signup', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'okay'
    });
})

// la fonction next indique au serveur qu'il peut passer au middleware suivant lorsque celui-ci est fait
// crée un middleware (fct exécutée entre reception requete et envoi reponse)
// renvoi le message au format json (le seul utilisable pour serveur) a chaque requete effectuée

app.use('api/books', bookRoutes)

// on exporte notre app (comme export default)
module.exports = app;