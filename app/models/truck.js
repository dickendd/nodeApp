var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TruckSchema = new Schema({
	name: String,
	address: String,
	geo: {
		type: {
			type: 'String',
			default: 'Point'
		},
		coordinates: {
			type: [Number],
			index: '2dSphere'
		}
	},
	windowCopy: String,
	menuUrl: String,
	createdBy: String
});

module.exports = mongoose.model('Truck', TruckSchema);
