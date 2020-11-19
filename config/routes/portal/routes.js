module.exports = function (app, passport) {

    app.get('/dashboard', isLoggedIn, function (req, res) {
        var message = ""; if(req.query.message) message = req.query.smessage
            res.render('portal/dashboard', { message: message, user: req.user.name, title: 'Dashboard' });
    });
    
};

/*Middleware Router*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
        
    res.redirect('/');
}