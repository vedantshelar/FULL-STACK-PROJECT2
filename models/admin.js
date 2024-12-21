const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
adminEmail:{
    type:String,
    required:true,
    unique: true
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
    },
    unique: true
}
});
 

const ADMIN = mongoose.model('ADMIN',adminSchema);

module.exports = ADMIN;