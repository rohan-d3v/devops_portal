/*Basic Information*/
const config = require('./config/config');
const pkg = require('./config/dependencies');
const port = process.env.PORT || 2020;

/*App Initialization*/
const app = pkg.express();

/*Mailer Config*/
const mailer = pkg.nodemailer.createTransport(config.mailerConfig);

/*DB Config*/
pkg.mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }); // Mongoose for login
var db = pkg.monk(config.dbURI); // Monk For Views
app.use(function (req, res, next) { req.db = db; next(); })

/*Passport Config*/
require('./config/passport')(pkg.passport);
app.use(pkg.session({ secret: config.passportClientSecret, saveUninitialized: false, resave: true }));
app.use(pkg.passport.initialize());
app.use(pkg.passport.session());
app.use(pkg.flash());

/*Logger Config*/
app.use(pkg.morgan('dev'));

/*Parser Config*/
app.use(pkg.cookieParser());
app.use(pkg.bodyParser.json({ extended: true }));
app.use(pkg.bodyParser.urlencoded({ extended: true }));

/*Views Config*/
app.set('view engine', 'ejs');
app.use(pkg.express.static(pkg.path.join(__dirname, 'public')));

/*Time Tracker Scheduler Config*/
pkg.scheduler.scheduleJob('0 0 * * *', function () {
    db.get('users').find({},{},(e, docs)=>{
        if(docs){
            for (i = 0; i < docs.length; i++){
                var date = new Date().toLocaleDateString();
                var dataObj = {
                    employee: docs[i]._id,
                    date: date,
                    active: false,
                    time_in: null,
                    time_out: null
                }
                db.get('attendance').insert(dataObj, {})
            }
        }
    })
    console.log('TimeSheets Created for '+new Date().toLocaleDateString())
});

/*Routes*/
/**Middleware Routes**/
require('./config/routes/middleware/login')(app, pkg.passport);

/**Portal Routes**/
require('./config/routes/portal/routes')(app, pkg.passport);
require('./config/routes/portal/account')(app, pkg.passport);
require('./config/routes/portal/tracker')(app, pkg.passport, pkg.scheduler)

/***Admin Routes***/
require('./config/routes/portal/admin')(app, pkg.passport);
require('./config/routes/portal/project')(app, pkg.passport, pkg.mongodb);


/*App Launch*/
app.listen(port);
console.log('Application Running on Port ' + port);