const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tempAdminSchema = mongoose.Schema({
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
    type:String,
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

tempAdminSchema.pre('save',async function (next){
    const adminInfo = this;
    if(adminInfo.isModified('adminPassword')){
       let myPlaintextPassword=adminInfo.adminPassword;
       const saltRounds = 4;
      
      const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
      adminInfo.adminPassword=hash;
      next();
    }else{
       next();
    } 
   })

const TEMPADMIN = mongoose.model('TEMPADMIN',tempAdminSchema);

module.exports = TEMPADMIN;