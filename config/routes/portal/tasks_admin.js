module.exports = function (app, passport, mongodb) {
    app.get('/manageTasks', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('projects').find({}, {}, (e, projectlist) => {
            req.db.get('users').find({}, {}, (e, userlist) => {
                req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                    res.render('portal/super/tasks/list', {
                        user: req.user, userlist: userlist, active: checkin.active,
                        projectlist: projectlist, message: message, title: 'Manage Tasks'
                    })
                })
            })
        })
    });

    app.post('/createTask', (req, res)=>{
        
    })
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function isAdmin(req, res, next) {
    if (req.user.admin)
        return next();
    res.redirect('/dashboard')
}