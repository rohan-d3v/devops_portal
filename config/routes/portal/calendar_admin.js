module.exports = function (app, passport, mongodb) {
    app.get('/manageCalendar', isLoggedIn, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('timesheets').find({}, {}, (e, timesheets) => {
            req.db.get('users').find({}, (e, userlist) => {
                req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                    res.render('portal/super/calendar/index', {
                        user: req.user, active: checkin.active, userlist: userlist,
                        timesheets: timesheets, message: message, title: 'My Calendar'
                    })
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