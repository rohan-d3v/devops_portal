module.exports = (app, passport, scheduler) =>{

}

/*Middleware Router*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
        
    res.redirect('/');
}