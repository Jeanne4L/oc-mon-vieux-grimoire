const http = require('http');
const app = require('./app');
require('dotenv').config();
const mongoose = require('mongoose');

// return valid port
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// handles errors
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
        case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
        default:
        throw error;
    }
};

const server = http.createServer(app);

// logs errors in the server
server.on('error', errorHandler);
// indicates the port of the app
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);

// database connection 
mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}.3jve4je.mongodb.net/?retryWrites=true&w=majority`,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));