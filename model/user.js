const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  password:{type:String,required:true},
  ticket:[
  ],
  userType:{type:String,default:'user'}
});

module.exports=mongoose.model('User',userSchema);