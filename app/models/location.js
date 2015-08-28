var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
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
    dateModified: Date
});

module.exports = mongoose.model('Location', LocationSchema);
