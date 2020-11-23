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
                    description: req.body.project_desc,
                    progress: 'Yet to Start',
                    users: assignments,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
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
        var assignments = []

        if (Array.isArray(req.body.assignmentList)) {
            for (j = 0; j < req.body.assignmentList.length; j++) assignments[j] = new mongodb.ObjectID(req.body.assignmentList[j])
        } else assignments[0] = new mongodb.ObjectID(req.body.assignmentList)
        req.db.get('projects').findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                description: req.body.project_desc,
                name: req.body.name,
                users: assignments,
            }
        }, (e, docs) => {
            res.redirect('/manageProject?message=Project Updated Successfully&uid=' + req.body.uid)
        })
    })
    app.post('/updateProjectStatus', (req, res) => {
        var complete = tHours = null;
        if (req.body.progress == "Completed") {
            complete = new Date().toLocaleDateString()
            tHours = ((new Date(new Date().toLocaleDateString()).getTime() - new Date(req.body.start_date).getTime()) / (1000 * 3600 * 24)) * 8
        }
        req.db.get('projects').findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                completed_date: complete,
                total_hours: tHours,
                progress: req.body.progress
            }
        }, (e, docs) => {
            res.redirect('/manageProject?message=Project Status Updated Successfully&uid=' + req.body.uid)
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