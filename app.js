const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

const express = require('express');
const helmet = require('helmet');
const app = express();

// allows cross-origin images
app.use(helmet({ 
    crossOriginResourcePolicy: { policy: "same-site" } 
}));

app.use(express.json());

// CORS - HTTP-Header allows cross-origin requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;