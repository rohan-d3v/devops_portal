module.exports = function (app, passport, mongodb) {
    app.get('/manageTasks', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('projects').find({}, {}, (e, projectlist) => {
            req.db.get('users').find({}, {}, (e, userlist) => {
                req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                    req.db.get('tasks').find({}, {}, (e, tasklist) => {
                        res.render('portal/super/tasks/list', {
                            user: req.user, userlist: userlist, active: checkin.active, tasklist: tasklist,
                            projectlist: projectlist, message: message, title: 'Manage Tasks'
                        })
                    })
                })
            })
        })
    });

    app.post('/createTask', (req, res) => {
        req.db.get('tasks').insert({
            name: req.body.task_name,
            start_date: null,
            end_date: req.body.end_date,
            completed_date: null,
            projected_hours: req.body.projected_hours,
            total_hours: null,
            status: "Yet to start",
            type: req.body.taskType,
            description: req.body.task_desc,
            person: new mongodb.ObjectID(req.body.assignmentList),
            project: new mongodb.ObjectID(req.body.projectName)
        }, (e, docs) => {
            res.redirect('/manageTasks?message=Task Created Successfully')
        })
    })

    app.get('/manageTask', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('tasks').findOne({ _id: req.query.uid }, {}, (e, tasklist) => {
            req.db.get('projects').find({}, {}, (e, projectlist) => {
                req.db.get('users').find({}, {}, (e, userlist) => {
                    req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                        res.render('portal/super/tasks/edit', {
                            user: req.user, userlist: userlist, active: checkin.active, tasklist: tasklist,
                            projectlist: projectlist, message: message, title: 'Manage Tasks'
                        })
                    })
                })
            })
        })
    });

    app.post('/updateTask', (req, res) => {
        req.db.get('tasks').findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                name: req.body.task_name,
                end_date: req.body.end_date,
                projected_hours: req.body.projected_hours,
                status: req.body.taskStatus,
                type: req.body.taskType,
                description: req.body.task_desc,
                person: new mongodb.ObjectID(req.body.assignmentList),
                project: new mongodb.ObjectID(req.body.projectName)
            }
        }, (e, docs)=>{
            res.redirect('/manageTask?message=Task Successfully Updated&uid='+req.body.uid)
        })
    })

    app.post('/updateTaskStatus', (req, res) => {
        var complete = start_date = null;
        if (req.body.taskStatus == "Completed") {
            complete = new Date().toLocaleDateString()
        }
        if (req.body.taskStatus == "In Progress") start_date = new Date().toLocaleDateString()
        req.db.get('tasks').findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                start_date: start_date,
                completed_date: complete,
                status: req.body.taskStatus
            }
        }, (e, docs) => {
            res.redirect('/manageTask?message=Project Status Updated Successfully&uid=' + req.body.uid)
        })
    })

    app.post('/deleteTask', isLoggedIn, isAdmin, (req, res) => {
        req.db.get('tasks').findOneAndDelete({ _id: req.body.uid }, (e, docs) => {
            res.redirect('/manageTasks?message=Task Successfully Deleted')
        })
    });
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