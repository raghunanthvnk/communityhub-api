const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const appointmentSchema = new Schema({
  EmployeeId: { type: String, default: null},
  CHServiceCatalogueId: { type: Number, default: null},
  CHRequestTypeId: { type: Number, default: null},
  BAUStatusMasterId:{ type: Number, default: null},
  BookedOn: { type: String, required: true},
  BookedBy:{ type: String, default: null},
  AppointmentDate: { type: String, default: null},
  InitiatedOn: { type: String, default: null},
  CompletedOn:{ type: String, default: null},
  CancelledOn: { type: String, required: true},
  CancelledBy: { type: String, default: null},
  CHHubServiceCatalogueId: { type: Number, required: true},
  ClientUTCOffset: { type: Number, required: true},
  CandidateName: { type: String, default: null},
  PhoneNumber: { type: String, default: null},
  AdditionalSpecialRequest: { type: String, default: null},
  ParticipantEmail: { type: String, default: null
    // required: true ,   
    // required: 'Email address is required',
    // validate: [validateEmail, 'Please fill a valid email address'],
    // match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address']
          },
  ISDCode: { type: String, default: null},
  ISDCodeKey: { type: String, default: null},
  ActionType: { type: String, default: null},
  IsActive: { type: Boolean, default:true },
  fileUploadId:{ type: String, default: null}
},
{ timestamps: true });

appointmentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Appointments', appointmentSchema);
