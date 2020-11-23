module.exports = function (app, passport, mongodb) {
    app.get('/manageCalendar', isLoggedIn, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('timesheets').find({ }, {}, (e, checkin) => {
            req.db.get('users').find({},(e, userlist)=>{
                res.render('portal/super/calendar/index', {
                    user: req.user, active: checkin.active, userlist: userlist,
                    timesheets: checkin, message: message, title: 'My Calendar'
                })
            })
        })
    })
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}