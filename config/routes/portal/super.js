const ObjectId = require('mongodb').ObjectID, userModel = require('../../models/user');
module.exports = function (app, passport) {

    /**Admin (Sub) Actions**/
    app.get('/manageAdmins', isLoggedIn, isSuper, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('users').find({}, {}, (e, adminList) => {
            res.render('portal/super/adminList', {
                user: req.user.name, admin: req.user.admin,
                adminlist: adminList, message: message, title: 'Manage Admins'
            })
        })

    });
    app.post('/createAdmin', isLoggedIn, isSuper, (req, res) => {
        var admin = false; if (req.body.superAdmin === "true") admin = true;
        var newpass = new userModel().generateHash(req.body.password);
        req.db.get('users').findOne({ email: req.body.email }, {}, function (e, docs) {
            if (!docs) {
                req.db.get('users').insert({
                    name: req.body.name, email: req.body.email,
                    password: newpass, confirmpass: req.body.password, admin: admin
                }, (e, docs) => {
                    res.redirect('/manageAdmins?message=Admin Created Successfully')
                })
            } else res.redirect('/manageAdmins?message=Admin Already exists')
        })
    });
    app.get('/manageAdmin', isLoggedIn, isSuper, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('users').findOne({ _id: req.query.uid }, {}, function (e, docs) {
            req.db.get('taxFiling').find({}, {}, (e, assignmentList) => {
                res.render('portal/super/editAdmin', {
                    user: req.user.name, admin: req.user.admin, title: 'Edit Admin',
                    person: docs, message: message, assignmentlist: assignmentList
                });
            })
        })
    });
    app.post('/updateAdmin', isLoggedIn, isSuper, (req, res) => {
        var admin = false; if (req.body.superAdmin === "true") admin = true;
        req.db.get('users').findOneAndUpdate({ _id: req.body.uid }, {
            $set: { name: req.body.name, email: req.body.email, superAdmin: admin }
        }, { new: true }, function (e, docs) {
            res.redirect('/manageAdmin?uid=' + req.body.uid + '&message=Admin Successfully Updated')
        })
    });
    app.post('/updateAdminPass', isLoggedIn, isSuper, (req, res) => {
        var newpass = new userModel().generateHash(req.body.password);
        req.db.get('users').findOneAndUpdate({ _id: req.body.uid }, {
            $set: { password: newpass, confirmpass: req.body.password }
        }, { new: true }, function (e, docs) {
            res.redirect('/manageAdmin?uid=' + req.body.uid + '&message=Admin Successfully Updated')
        })
    });
    app.post('/deleteAdmin', isLoggedIn, isSuper, (req, res) => {
        req.db.get('users').findOneAndDelete({ _id: req.body.uid }, (e, docs) => {
            res.redirect('/manageAdmins?uid=' + req.body.uid + '&message=Admin Successfully Deleted')
        })
    });

}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function isSuper(req, res, next) {
    if (req.user.admin)
        return next();
    res.redirect('/dashboard')
}