const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'No esta autorizado, primero inicie sesión');
    res.redirect('/users/signin');
};

module.exports = helpers;