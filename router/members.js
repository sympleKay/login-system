//Required Dependencies
const express = require ('express');
const Member = require('../model/member');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuth} = require('../config/auth');
const router = express.Router();

//Body Parser Middleware
let urlencoded = bodyParser.urlencoded( {extended: false} );
let jsonParser = bodyParser.json();

//Render Login Page
router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/login', (req, res) => {
    res.render('login');
})

//Render Dashboard after Login
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {name: req.user.username});
    console.log(`${req.user.username} Logged in.`);
})


// Register a new member
router.post('/register', urlencoded, (req, res) => {
    // Get form fields from form
    const { username, email, password, password2 } = req.body;

    // Check for errors
    let errors = [];
    //Check that fields are not empty
    if (!username || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all the fields'});
    }
    //check if Password matches
    if (password !== password2) {
        errors.push({msg: 'Passwords do not match'});
    }
    //Check password length if it is freater than 5
    if (password.length < 5) {
        errors.push({msg: 'Password must be at least 5 characters'});
    }

    // Check if there validation from the above
    if (errors.length > 0) {
        res.render('register', {errors, username, email, password, password2});
    } else {
        // Else, that is, if the above form validation passes
        // Check if Email already exist
        Member.findOne({ email: email }, (err, member) => {
            if (err) {
                console.log (err);
            }
            if (member) {
                errors.push({msg: 'User with that email already exist'});
                res.render('register', {errors, username, email, password, password2});
                console.log(email);
            } else {
                //Else, that is, the emailhas not be registered, move on with registration
                const newMember = new Member({
                    username,
                    email,
                    password
                })
                //Hash Password using bcryptjs
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newMember.password, salt, (err, hash) => {
                        if (err) {throw err};
                        //Change plain password to Hashed
                        newMember.password = hash;

                        //Save member to DB
                        newMember.save((err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success_msg', 'Your Registration was successful, you can log in');
                                res.redirect('/member/login');
                                console.log(`User ${username} saved to DB successfully`);
                            }
                        })
                    })
                })
            }
        });
    }
})

//Login route
router.post('/login', urlencoded, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/member/dashboard',
        failureRedirect: '/member/login',
        failureFlash: true
    })(req, res,next)
})

//Logout memeber
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'Logged out');
    res.redirect('/member/login');
})


// Export router
module.exports = router;