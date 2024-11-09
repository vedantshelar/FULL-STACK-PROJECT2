const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    studName: {
        type: String,
        uppercase: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    userType:{
        type:String,
        default:'general',
        required:true
    },
    studMobile: {
        type: String, 
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Regex to check exactly 10 digits
            },
            message: props => `${props.value} is not a valid mobile number! It must be exactly 10 digits.`,
        },
    },
    studBranch: {
        type: String,
        lowercase: true,
        required: true,
        enum: ["information technology", "computer engineering", "mechanical engineering"]
    },
    studCourse: {
        type: String,
        lowercase: true,
        required: true,
        enum: ["diploma", "degree"]
    },
    studEnrollNo: {
        type: Number,
        required: true
    },
    studYear: {
        type: String,
        uppercase: true,
        required: true,
        enum: ["FY", "SY", "TY"]
    },
    studPic: {
        type: String,
        required: true
    },
    studResume: [
        {
            type: String
        }
    ],
    programmingLanguages: [{
        type: String,
        uppercase: true
    }],
    skills: [{
        type: String,
        uppercase: true
    }],
    projects: [{
        type: mongoose.Types.ObjectId,
        ref: 'PROJECT'
    }]
})

// Query middleware 

studentSchema.post('findOneAndDelete', async (studentInfo) => {
    const PROJECT = require('./projects');
    const projectIds = studentInfo.projects;
    console.log(studentInfo);
    console.log(projectIds);
    
        const temp = await PROJECT.deleteMany({ _id: { $in: projectIds } });

        console.log(temp)

    console.log('student account has been permanetly deleted');
}); 

// query middleware to has password

studentSchema.pre('save',async function (next){
 const studentInfo = this;

 if(studentInfo.isModified('password')){

    myPlaintextPassword=this.password;
    const saltRounds = 4;
   
   const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
   this.password=hash;
   next();
 }else{
    next();
 }
})

const STUDENT = mongoose.model('STUDENT', studentSchema);

module.exports = STUDENT;