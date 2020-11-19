const config = require('./config/config');
const pkg = require('./config/dependencies');
const port = process.env.PORT || 2020;

const app = pkg.express();

/*Mailer Config*/
const mailer = pkg.nodemailer.createTransport(config.mailerConfig);