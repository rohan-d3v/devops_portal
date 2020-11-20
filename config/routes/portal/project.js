module.exports = function (app, passport, mongodb) {
    app.get('/manageProjects', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('projects').find({}, {}, (e, projectlist) => {
            req.db.get('users').find({}, {}, (e, userlist) => {
                req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                    res.render('portal/super/projects/list', {
                        user: req.user, userlist: userlist, active: checkin.active,
                        projectlist: projectlist, message: message, title: 'Manage Projects'
                    })
                })
            })
        })
    });
    app.post('/createProject', isLoggedIn, isAdmin, (req, res) => {
        req.db.get('projects').findOne({ name: req.body.project_name }, {}, (e, docs) => {
            if (!docs) {
                assignments = []
                if (req.body.assignmentList) {
                    if (Array.isArray(req.body.assignmentList)) {
                        for (j = 0; j < req.body.assignmentList.length; j++) assignments[j] = new mongodb.ObjectID(req.body.assignmentList[j])
                    } else assignments[0] = new mongodb.ObjectID(req.body.assignmentList)
                }
                req.db.get('projects').insert({
                    name: req.body.project_name, 
                    progress: 'Yet to Start', 
                    users: assignments, 
                    start_date: req.body.start_date, 
                    end_date: req.body.end_date, 
                    projected_hours: req.body.total_hours,
                    completed_date: null,
                    total_hours: null
                }, (e, docs) => {
                    res.redirect('/manageProjects?message=Project Created Successfully')
                })
            } else res.redirect('/manageProjects?message=Project Already exists')
        })
    })

    app.get('/manageProject', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('projects').findOne({ _id: req.query.uid }, {}, (e, project) => {
            req.db.get('users').find({}, {}, (e, userlist) => {
                req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                    res.render('portal/super/projects/edit', {
                        user: req.user, userlist: userlist, active: checkin.active,
                        project: project, message: message, title: 'Manage Project'
                    })
                })
            })
        })
    });

    app.post('/updateProject', isLoggedIn, isAdmin, (req, res) => {
        var complete = tHours = null
        if(req.body.progress == "Completed"){ 
            complete = new Date().toLocaleDateString()
            var diffDays = (new Date(start_date).getTime() - new Date(complete).getTime())/(1000*3600*24)
            var tHours = diffDays * 8
        }
        assignments = []
        if (Array.isArray(req.body.assignmentList)) {
            console.log(req.body.assignmentList)
            for (j = 0; j < req.body.assignmentList.length; j++) assignments[j] = new mongodb.ObjectID(req.body.assignmentList[j])
        } else assignments[0] = new mongodb.ObjectID(req.body.assignmentList)
        req.db.get('projects').findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                progress: req.body.progress,
                projected_hours: req.body.total_hours,
                name: req.body.name,
                users: assignments,
                completed_date: complete,
                total_hours: tHours
            }
        }, (e, docs) => {
            res.redirect('/manageProject?message=Project Updated Successfully&uid=' + req.body.uid)
        })
    })
    app.post('/deleteProject', isLoggedIn, isAdmin, (req, res) => {
        req.db.get('projects').findOneAndDelete({ _id: req.body.uid }, (e, docs) => {
            res.redirect('/manageProjects?message=Project Successfully Deleted')
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