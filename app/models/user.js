const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
  first_name: { type: String, default: null, required: true},
  last_name: { type: String, default: null, required: true},
  email:{ type: String, 
        required: true ,   
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address'],
        unique: true    
    },
  username: { type: String, required: true,unique: true },
  password: { type: String, required: true},
  isactive: { type: Boolean, default:true },
  token: { type: String }
},
{ timestamps: true });


userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
