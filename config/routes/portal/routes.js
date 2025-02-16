module.exports = function (app, passport) {

    app.get('/dashboard', isLoggedIn, function (req, res) {
        var message = ""; if (req.query.message) message = req.query.smessage
        req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
            req.db.get('tasks').find({person: req.user._id}, {}, (e, tasklist)=>{
                res.render('portal/dashboard', { message: message, user: req.user, title: 'Dashboard', active: checkin.active, tasklist: tasklist });
            })
        })
    });

};

/*Middleware Router*/
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}