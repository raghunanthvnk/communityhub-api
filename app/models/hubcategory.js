const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const hubCategorySchema = new Schema({
  name: { type: String, required: true ,unique: true },
  description: { type: String, required: true},
  isdefaultbookingtime: { type: Boolean, required: true },
  isactive: { type: Boolean, default:true  },
  createdby: { type: String },
  updatedby: { type: String},
  hubmaster: [{ type: mongoose.Types.ObjectId,  ref: 'HubMaster' }]
},
{ timestamps: true });

hubCategorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('HubCategory', hubCategorySchema);
