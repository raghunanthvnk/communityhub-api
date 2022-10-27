const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const hubMasterSchema = new Schema({
  name: { type: String, required: true ,unique: true },
  code: { type: String, required: true},
  countrycode: { type: String, required: true },
  citycode: { type: String, required: true },
  othercity: { type: String},
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  slotmasterid: { type: Number, required: true },
  timezoneid: { type: Number, required: true },
  isbookingenabled: { type: Boolean, required: true },
  bookingstarttimeid: { type: Number, required: true },
  bookingendtimeid: { type: Number, required: true },
  updatedby: { type: String},
  createdby: { type: String},
  hubcategory: { type: mongoose.Types.ObjectId, required: true, ref: 'HubCategory' }
},
{ timestamps: true });

hubMasterSchema.plugin(uniqueValidator);

module.exports = mongoose.model('HubMaster', hubMasterSchema);
