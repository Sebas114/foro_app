const router = require('express').Router();

const User = require('../models/User');
const { isAuthenticated } = require('../helpers/auth');

const passport = require('passport');
const { unregisterDecorator } = require('handlebars');

router.get('/users/signin', (req, res) => {
    res.render('users/signin')
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/topics',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup')
});

router.post('/users/signup', async(req, res) => {
    const { email, password, confirm_password } = req.body;
    const errors = [];
    const emailUser = await User.findOne({ email: email });
    if (password !== confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser al menos de 4 dígitos.' });
    }
    if (emailUser) {
        errors.push({ text: 'El correo ya esta en uso.' });
    }
    if (!email.endsWith('@udea.edu.co')) {
        errors.push({ text: 'El correo no pertenece a la Universidad de Antioquia' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, email, password, confirm_password });
    } else {


        const newUser = new User({ email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Se ha registrado exitosamente');
        res.redirect('/users/signin');
    }
});

router.get('/users/users-views', isAuthenticated, async(req, res) => {
    const users = await User.find().sort({ date: 'desc' });
    res.render('users/views-users', { users });

});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/users/signin');
});
module.exports = router;