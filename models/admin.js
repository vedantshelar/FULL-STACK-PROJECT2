const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
adminEmail:{
    type:String,
    required:true
},
adminPassword:{
    type:String,
    required:true
},
adminType:{
    type:String,
    required:true,
    enum:["generalAdmin","superAdmin"],
    default:'generalAdmin'
},
adminMobileNo:{
    type:Number,
    required:true,
    validate:{
        validator:function(v){
            return /^\d{10}$/.test(v);
        },
        message:function(v){
            return `${v} must be 10 digit`
        }
    }
}
});

// query middleware to has password

adminSchema.pre('save',async function (next){
    const adminInfo = this;
   console.log(adminInfo)
    if(adminInfo.isModified('adminPassword')){
   
       let myPlaintextPassword=adminInfo.adminPassword;
       const saltRounds = 4;
      
      const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
      adminInfo.adminPassword=hash;
      console.log(adminInfo.adminPassword)
      next();
    }else{
       next();
    } 
   })

const ADMIN = mongoose.model('ADMIN',adminSchema);

module.exports = ADMIN;