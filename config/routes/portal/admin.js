const userModel = require('../../models/user');
module.exports = function (app, passport) {

    /**Admin (Sub) Actions**/
    app.get('/manageUsers', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('users').find({}, {}, (e, userlist) => {
            req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                res.render('portal/super/users/list', {
                    user: req.user.name, admin: req.user.admin, active: checkin.active,
                    userlist: userlist, message: message, title: 'Manage Admins'
                })
            })
        })
    });
    app.post('/createUser', isLoggedIn, isAdmin, (req, res) => {
        var admin = false; if (req.body.superAdmin === "true") admin = true;
        var newpass = new userModel().generateHash(req.body.password);
        req.db.get('users').findOne({ email: req.body.email }, {}, function (e, docs) {
            if (!docs) {
                req.db.get('users').insert({
                    name: req.body.name, email: req.body.email,
                    password: newpass, confirmpass: req.body.password, admin: admin
                }, (e, docs) => {
                    res.redirect('/manageUsers?message=User Created Successfully')
                })
            } else res.redirect('/manageUsers?message=User Already exists')
        })
    });
    app.get('/manageUser', isLoggedIn, isAdmin, (req, res) => {
        var message = ""; if (req.query.message) message = req.query.message
        req.db.get('users').findOne({ _id: req.query.uid }, {}, function (e, docs) {
            req.db.get('taxFiling').find({}, {}, (e, assignmentList) => {
                req.db.get('timesheets').findOne({ employee: req.user._id, date: new Date().toLocaleDateString() }, {}, (e, checkin) => {
                    res.render('portal/super/users/edit', {
                        user: req.user.name, admin: req.user.admin, title: 'Edit User', active: checkin.active,
                        person: docs, message: message
                    });
                })
            })
        })
    });
    app.post('/updateUser', isLoggedIn, isAdmin, (req, res) => {
        var admin = false; if (req.body.superAdmin === "true") admin = true;
        req.db.get('users').findOneAndUpdate({ _id: req.body.uid }, {
            $set: { name: req.body.name, email: req.body.email, admin: admin }
        }, { new: true }, function (e, docs) {
            res.redirect('/manageUser?uid=' + req.body.uid + '&message=User Successfully Updated')
        })
    });
    app.post('/updateUserPass', isLoggedIn, isAdmin, (req, res) => {
        var newpass = new userModel().generateHash(req.body.password);
        req.db.get('users').findOneAndUpdate({ _id: req.body.uid }, {
            $set: { password: newpass, confirmpass: req.body.password }
        }, { new: true }, function (e, docs) {
            res.redirect('/manageUser?uid=' + req.body.uid + '&message=User Successfully Updated')
        })
    });
    app.post('/deleteUser', isLoggedIn, isAdmin, (req, res) => {
        req.db.get('users').findOneAndDelete({ _id: req.body.uid }, (e, docs) => {
            res.redirect('/manageUsers?uid=' + req.body.uid + '&message=User Successfully Deleted')
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