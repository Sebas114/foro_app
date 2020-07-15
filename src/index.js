const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const errorHandler = require('errorhandler');
const { equal } = require('assert');

// Initiliazations
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)

}));
app.set('view engine', '.hbs');


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.json());

//Global variables
app.use(async(req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    if (req.user) { res.locals.userid = req.user.id } else { res.locals.userid = null };
    if (req.user) { res.locals.user = req.user.email } else { res.locals.user = null };
    if (req.user) { if (req.user.email == 'admin@udea.edu.co') { res.locals.cond = true } else { res.locals.cond = false } };

    next();
});



// Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/topics'));
app.use(require('./routes/foro'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

//errorhandlers
if ('development' === app.get('env')) {
    app.use(errorHandler);
}
return app;