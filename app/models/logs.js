const mongoose  = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema  = mongoose.Schema;

const LogSchema = new Schema({
    time: Date,
    file: String,
    line: String,
    info: Mixed,
    type: String

},{ timestamps: true },{collection: 'logs'});

module.exports = mongoose.model('logs', LogSchema);