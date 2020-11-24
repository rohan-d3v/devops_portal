module.exports = function (app, passport, mongodb) {
    app.get('/myCalendar', isLoggedIn, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('timesheets').find({ employee: req.user._id }, {}, (e, timesheets) => {
            req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                res.render('portal/calendar/index', {
                    user: req.user, active: checkin.active,
                    timesheets: timesheets, message: message, title: 'My Calendar'
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