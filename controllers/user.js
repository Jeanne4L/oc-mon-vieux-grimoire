const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Create a new User 
exports.signup = (req, res, next) => {
    // hash encrypts password with 10 iterations
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({
            message: 'User created'
        }))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

// Login an existing user
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(user === null) {
            res.status(401).json({
                message: 'Incorrect username/password pair'
            })
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({
                        message: 'Incorrect username/password pair'
                    })
                } else {
                    // return user authentication info, a token valid for 24h and validated with the secret key
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.SECRET_KEY,
                            {expiresIn: '24h'}
                        )
                    })
                }
            })
            .catch(error => res.status(500).json({error}))
        }

    })
    .catch(error => res.status(500).json({error}))
}