
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
	name: String,
	geo: {
		type: {type : String},
        coords: { 
        	latitude: {type : Number},
        	longitude: {type: Number}
        }
	}
});

module.exports = mongoose.model('Bear', BearSchema);
