const userModel = require('../../models/user');
module.exports = function (app, passport) {
    app.get('/account', isLoggedIn, (req, res) => {
        var flashMessage=""; if (req.query.message) flashMessage = req.query.message
        req.db.get('users').findOne({ _id: req.user._id }, {}, function (e, docs) {
            req.db.get('timesheets').findOne({employee: req.user._id, date: new Date().toLocaleDateString()}, {}, (e, checkin)=>{
                res.render('portal/account', {
                    user: req.user, active: checkin.active,
                    adminDetails: docs, message: flashMessage, title: 'Account'
                });
            })
        })
    });
    app.post('/updateProfile', isLoggedIn, (req, res) => {
        req.db.get('users').findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                name: req.body.name,
                email: req.body.email
            }
        }, { new: true }, (e, docs) => {
            res.redirect('/account?message=User has been successfully updated')
        })
    })

    app.post('/updatePass', isLoggedIn, (req,res)=>{
        var newpass = new userModel().generateHash(req.body.password);
        req.db.get('users').findOneAndUpdate({ _id: req.user._id }, {
            $set: {
                password: newpass,
                confirmpass: req.body.password
            }
        }, { new: true }, (e, docs) => {
            res.redirect('/account?message=Password has been successfully updated')
        })
    })
}

/*Middleware Router*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
        
    res.redirect('/');
}