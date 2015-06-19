var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var UserSchema   = new Schema({
    email: String,
    password: String,
	role: String,
    token: String,
    fbToken: String,
    fbPage: {}
});
 
module.exports = mongoose.model('User', UserSchema);