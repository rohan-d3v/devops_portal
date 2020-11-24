module.exports = function (app, passport, mongodb, mailer) {
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
    app.post('/newCalendarLeave', isLoggedIn, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        var days = 1;
        if (req.body.start_date != req.body.end_date)
            days = (new Date(req.body.end_date).getTime() - new Date(req.body.start_date).getTime()) / (1000 * 3600 * 24)
        var emailArr = ['rohan.krishna1996@gmail.com', 'rohankrishna@infographicanalytics.com']
        var subject = "[Day(s) Off Request] " + req.user.name + ": " + req.body.start_date 
        subject += ' to ' + req.body.end_date+' - '+req.body.subject
        var body =  req.user.name + " has requested " + days + " days(s) off<br>"
        body += req.body.description+'<br>'
        body += 'Please update as soon as possible'
        const mailInfo = {
            from: 'n/a', to: emailArr,
            subject: subject, text: body
        }
        mailer.sendMail(mailInfo)
        req.db.get('leaves').insert({
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            days: days,
            member: req.user._id,
            subject: req.body.subject,
            description: req.body.description,
            applied: new Date().toLocaleDateString(),
            status: 'pending'
        }, {}, (e, docs) => {
            res.redirect('/myCalendar?message=Leave Successfully Requested')
        })
    })
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}