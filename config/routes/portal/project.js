const ObjectId = require('mongodb').ObjectID
module.exports = function (app, passport) {
    app.get('/manageProjects', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('projects').find({}, {}, (e, projectlist) => {
            req.db.get('users').find({},{},(e, userlist)=>{
                res.render('portal/super/projects/list', {
                    user: req.user.name, admin: req.user.admin, userlist: userlist,
                    projectlist: projectlist, message: message, title: 'Manage Admins'
                })
            })
        })
    });
    app.post('/createProject', isLoggedIn, isAdmin, (req,res)=>{
        req.db.get('projects').findOne({name: req.body.project_name},{}, (e, docs)=>{
            if (!docs) {
                req.db.get('projects').insert({
                    name: req.body.project_name, progress:'Yet to Start', users: req.body.assignmentList
                }, (e, docs) => {
                    res.redirect('/manageProjects?message=Project Created Successfully')
                })
            } else res.redirect('/manageProjects?message=Project Already exists')
        })
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