var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    member_id: String,
    name: String,
    email: String,
    mobile: String,
    designation: String,
    doj: String,
    dob: String,
    gender: String,
    address: String,
    password: String,
    confirm_password: String,
    admin: Boolean
});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);