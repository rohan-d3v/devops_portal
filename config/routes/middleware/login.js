module.exports = function (app, passport) {
    app.get('/login', loginPageCheck, function (req, res) {
        var message = req.flash('loginMessage');
        if (req.query.message) message = req.query.message
        res.render('middleware/login', { message: message, title: 'Login', });
    });
    app.get('/', loginPageCheck, function (req, res) {
        res.redirect('/login')
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

function loginPageCheck(req, res, next) {

    if (!req.isAuthenticated())
        return next();

    res.redirect('/dashboard');
}