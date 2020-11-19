module.exports = (app, passport, scheduler) =>{
    app.get('/tracker', isLoggedIn, (req,res)=>{
        var today = new Date().toLocaleDateString()
        req.db.get('timesheets').findOne({employee: req.user._id, date: today},{},(e, time)=>{
            res.render('portal/tracker', {title: 'Track your Time', data: time, admin: req.user.admin, user: req.user.name})
        })
    })
}

/*Middleware Router*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
        
    res.redirect('/');
}