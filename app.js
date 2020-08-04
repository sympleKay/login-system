// Required dependencies
const express = require ('express');
const dotenv = require ('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MongoDB = require('./config/db');
const router = require('./router/members');
const app = express();


//Pasport config
require('./config/passport')(passport);

//Load Configuration file and set port
dotenv.config({ path: './config/config.env' });
let PORT = process.env.PORT || 3000;

// Call MongoDB to connect to DB
MongoDB();

//Body Parser Middleware
let urlencoded = bodyParser.urlencoded( {extended: false} );
let jsonParser = bodyParser.json();

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//Initialiaze Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash())

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// Router
app.get('/', (req, res) => {
    res.redirect('/member/register');
})
app.use('/member', router);

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})