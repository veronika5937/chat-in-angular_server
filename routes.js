const express = require('express');
const router = express.Router();

const mongoConnected = require('./db.js');
const jwt = require('jsonwebtoken');
const config = require('./config');
const fs = require('fs');
const marked = require('marked') //?

var User = require('./app/models/user');
var Message = require('./app/models/msg');
var Channel = require('./app/models/channel');
const bcrypt = require('bcrypt-nodejs');

// main route
router.get('/', (req, res, next) => {
    fs.readFile(`${__dirname}/readme.md`, 'utf8', (err, data) => {
        if (err) return next(err);
        res.send(marked(data.toString()));
    })
})

// users
router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    })
})



// registration
router.post('/signup', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({
            status: 400,
            message: 'Please pass name and password.'
        });
    }

    bcrypt.hash(req.body.password, null, null, function (err, hash) {
        if (err) console.log(err)

        var newUser = new User({
            username: req.body.username,
            password: hash,
            email: req.body.email,
            online: false
        });
        // save the user
        newUser.save(err => {
            if (err) {
                res.status(409).json({ message: 'Username already exists' });
                return res.send();
            }
            res.status(201).json({
                status: 201,
                message: 'Successful created new user'
            })
        })
        // Store hash in your password DB.
    });

})


//login 
router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username },
        { '_id': 0, 'password': 0, '__v': 0 },
        (err, user) => {
            if (!user || err) {
                res.status(404).json({
                    status: 404,
                    message: 'User not found'
                })
            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user.toObject(), config.jwt_secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                res.status(200).json({
                    user,
                    token,
                    tokenType: 'Bearer',
                })
            }
        })
})

// messages
router.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'internal server error' });
        }
        res.json(messages);
    })

})


// channels
router.get('/channels', (req, res) => {
    Channel.find({}, (err, channels) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: 'internal server error' });
        }
        res.json(channels);
    })

})

module.exports = router