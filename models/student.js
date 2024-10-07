const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studName: {
        type: String,
        lowerCase: true,
        required: true,
        minLength: 3
    },
    studBranch: {
        type: String,
        lowerCase: true,
        required: true,
        enum: ["information technology", "computer engineering", "mechanical engineering"]
    },
    studCourse: {
        type: String,
        lowerCase: true,
        required: true,
        enum: ["diploma", "degree"]
    },
    studEnrollNo: {
        type: Number,
        required: true
    },
    studYear: {
        type: String,
        lowerCase: true,
        required: true,
        enum: ["FY", "SY", "TY"]
    },
    studPic: {
        type: String,
        required: true
    },
    studResume:[
        {
            type:String
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

const STUDENT = mongoose.model('STUDENT', studentSchema);

module.exports = STUDENT;