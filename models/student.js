const mongoose = require('mongoose');

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

const STUDENT = mongoose.model('STUDENT', studentSchema);

module.exports = STUDENT;