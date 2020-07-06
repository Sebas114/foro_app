const router = require('express').Router();

const User = require('../models/User');

const passport = require('passport');

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
    const { rol, email, password, confirm_password } = req.body;
    const errors = [];
    const emailUser = await User.findOne({ email: email }).lean();
    if (password != confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser al menos de 4 dígitos.' });
    }
    if (emailUser) {
        errors.push({ text: 'El correo ya esta en uso.' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, rol, email, password, confirm_password });
    } else {


        const newUser = new User({ rol, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Se ha registrado exitosamente');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/users/signin');
});
module.exports = router;