var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TruckSchema = new Schema({
	name: String,
	address: String,
	geo: {
		type: {type : String},
        coords: { 
        	latitude: {type : Number},
        	longitude: {type: Number}
        }
	},
	windowCopy: String,
	menuUrl: String
});

module.exports = mongoose.model('Truck', TruckSchema);
