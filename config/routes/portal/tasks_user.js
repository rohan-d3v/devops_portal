module.exports = function (app, passport, mongodb) {
    app.get('/myTasks', isLoggedIn, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('projects').find({}, {}, (e, projectlist) => {
            req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                req.db.get('tasks').find({ person: req.user._id }, {}, (e, tasklist) => {
                    res.render('portal/tasks/list', {
                        user: req.user, projectlist: projectlist, active: checkin.active, tasklist: tasklist,
                        message: message, title: 'Manage Tasks'
                    })
                })
            })
        })
    });

    app.get('/myTask', isLoggedIn, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('tasks').findOne({ _id: req.query.uid }, {}, (e, tasklist) => {
            req.db.get('projects').find({}, {}, (e, projectlist) => {
                req.db.get('users').find({}, {}, (e, userlist) => {
                    req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                        res.render('portal/tasks/edit', {
                            user: req.user, userlist: userlist, active: checkin.active, tasklist: tasklist,
                            projectlist: projectlist, message: message, title: 'Manage Tasks'
                        })
                    })
                })
            })
        })
    });

    app.post('/updateMyTask', (req, res) => {
        var tHours = start_date = null;
        if (req.body.taskStatus == "In Progress") start_date = new Date().toLocaleDateString()
        if (req.body.taskStatus == "QA & Review") tHours = (((new Date().toLocaleDateString() - new Date(docs.start_date).toLocaleDateString) / (1000 * 3600 * 24))) * 8
        req.db.get('tasks').findOne({ _id: req.body.uid }, {}, (e, docs) => {
            var date = start_date; if(docs.start_date) date = docs.start_date
            req.db.get('tasks').findOneAndUpdate({ _id: req.body.uid }, {
                $set: {
                    start_date: date,
                    total_hours: tHours,
                    status: req.body.taskStatus
                }
            }, (e, docs) => {
                res.redirect('/myTask?message=Task Status Updated Successfully&uid=' + req.body.uid)
            })
        })


    })
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
