const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const fileUploadSchema = new Schema({
  filename: { type: String, default: null, required: true},
  path: { type: String, default: null, required: true},
  type: { type: String, default: null, required: true},
  size:{ type: String, default: null, required: true},
  userid: { type: String, required: true},
  isactive: { type: Boolean, default:true }
},
{ timestamps: true });

fileUploadSchema.plugin(uniqueValidator);

module.exports = mongoose.model('FileUpload', fileUploadSchema);
