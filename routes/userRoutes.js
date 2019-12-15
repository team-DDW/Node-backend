const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv/config")

//register new user
router.post('/register', (req, res) => {
    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        password: req.body.password,
        role: req.body.role,
        link: req.body.link,
        username: req.body.username
    }
    // Search if email exists or not
    User.findOne({ email: req.body.email })
        .then(user => {
            // if email doesn't exist
            if (!user) {
                // hashing step
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    newUser.password = hash
                    User.create(newUser)
                        .then(() => res.send("user created " + newUser.email))
                        .catch(err => res.send(err))
                })
            }
            // if email is exist
            else {
                //maybe I should add a number in here to check
                res.send('email is already used')
            }
        })
        .catch(err => res.send(err))
})

// Login steps (1-login) 
router.post('/login', (req, res) => {
    //check email is exist or not
    User.findOne({ email: req.body.email })
        .then(user => {
            // if email is exist
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    user.password = "" //  "" we don't want password to appear
                    var paylod = { user }
                    let token = jwt.sign(paylod, process.env.SECRET_KEY, { expiresIn: 1440 })
                    res.send(token)
                }
                // if password isn't the same
                else {
                    res.send("password is not correct")
                }
            }
            else {
                // if email doesn't exist
                res.send("email is not found")
            }
        })
        .catch(err => res.send(err))
})

// Logout steps
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    // res.redirect('/user/login');
});

// change password (1-ch)
router.put('/changepass/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    var newPassword = hash
                    User.findByIdAndUpdate(req.params.id, { password: newPassword })
                        .then(() => res.send(`password changed`))
                        .catch(err => res.send(err))
                })
            } else {
                res.json({ msg: 'password not match' })
            }
        }).catch(err => res.send(err))
})

//change details
router.put('/changedetails/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then((user) => res.json({ msg: 'your data is updated', user: user }))
        .catch(err => res.send(err))
})

// for update token after edit data 
router.post('/edit/token', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                var paylod = { user }
                let token = jwt.sign(paylod, process.env.SECRET_KEY, { expiresIn: 1440 })
                res.send(token)
            }
            else {
                // if email not exist
                res.send("email is not found")
            }
        })
        .catch(err => res.send(err))
})

module.exports = router
