module.exports = (app, passport) =>{
    app.post('/timeTracker',isLoggedIn, (req,res)=>{
        var dataObj = {
            active: true,
            time_in: req.body.timeTrack,
            time_out: null
        }
        if(req.body.inOutTrack == 'out'){
            dataObj = {
                active: false,
                time_out: req.body.timeTrack
            }
        }
        req.db.get('timesheets').findOneAndUpdate({employee: req.user._id, date: new Date().toLocaleDateString},{
            $set: dataObj
        })
    })
}

/*Middleware Router*/
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
        
    res.redirect('/');
}