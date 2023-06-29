const jwt = require('jsonwebtoken');

// Check the user is logged in and valid
module.exports = (req, res, next) => {
    try {
        // get the token and remove the word Bearer
        const token = req.headers.authorization.split(' ')[1];
        // checks that the token is valid thanks to the secret key
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }
        next();
    } catch(error) {
        res.status(401).json({error})
    }
}