const STUDENT = require('../models/student');
const PROJECT = require('../models/projects');
const twilio = require('twilio');

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const signInForm = (req, res) => {
    res.render('signInForm.ejs');
}

const signUpForm = (req, res) => {
    res.render('createNewProfileForm.ejs');
}

const renderUserProfile = (req, res) => {
    const studId = req.session.currUser.studId;
    res.redirect(`/profile/${studId}`);
}

const redirectHomePage = (req, res) => {
    res.redirect('/home');
}

const renderHomePage = async (req, res) => {
    const studentInfo = await STUDENT.find();
    res.render('index.ejs', { studentInfo });
}

const renderFilterForm = async (req, res, next) => {
    try {
        const skillInfo = await STUDENT.find({}, { skills: 1, _id: 0 });

        let allUniqueSKills = [];
        let allSKills = [];
        for (skill of skillInfo) {
            let allSkillArr = skill.skills;
            for (s of allSkillArr) {
                if (allUniqueSKills.indexOf(s) == -1) {
                    allUniqueSKills.push(s)
                }
            }
        }
        res.render('filterForm.ejs', { skills: allUniqueSKills })
    } catch (error) {
        next(error);
    }
}

const displayFilterResult = async (req, res, next) => {
    try {
        const studCourse = req.body.studCourse;
        const studBranch = req.body.studBranch;
        const studYear = req.body.studYear;
        const studSkill = req.body.studSkill;
        const filter = {};
        if (studCourse !== 'all') {
            filter.studCourse = studCourse;
        }
        if (studBranch !== 'all') {
            filter.studBranch = studBranch;
        }
        if (studYear !== 'all') {
            filter.studYear = studYear;
        }

        filter.skills = { $in: [studSkill] };

        const studentInfo = await STUDENT.find(filter);
        if (studentInfo.length > 0) {
            res.render('index.ejs', { studentInfo });
        } else {
            console.log("no shuch match exist")
            res.redirect('/filter');
        }
    } catch (error) {
        next(error)
    }
}

const renderChart = async (req, res, next) => {
    try {
        const skillInfo = await STUDENT.find({}, { skills: 1, _id: 0 });

        let allUniqueSKills = [];
        for (skill of skillInfo) {
            let allSkillArr = skill.skills;
            for (s of allSkillArr) {
                if (allUniqueSKills.indexOf(s) == -1) {
                    allUniqueSKills.push(s)
                }
            }
        }

        let allDuplicateSkills = [];
        for (skill of skillInfo) {
            let allSkillArr = skill.skills;
            for (s of allSkillArr) {
                allDuplicateSkills.push(s);
            }
        }

        let skillMap = {};

        for (let i = 0; i < allUniqueSKills.length; i++) {
            let count = 0;
            for (let j = 0; j < allDuplicateSkills.length; j++) {
                if (allUniqueSKills[i] === allDuplicateSkills[j]) {
                    count = count + 1;
                    skillMap[allUniqueSKills[i]] = count;
                }
            }
        }

        let labels = [];
        let chartData = [];

        for (key in skillMap) {
            labels.push(key);
            chartData.push(skillMap[key]);
        }

        res.render('chart.ejs', { labels: labels, data: chartData });
    } catch (error) {
        next(error)
    }
}

const sendOtpToChangePassword = async (req, res, next) => {

    try {
        const studId = req.params.studId;
        const student = await STUDENT.findById(studId);
        const studMobile = student.studMobile;

        // Function to generate OTP
        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
        }

        req.session.sentOtp = generateOTP().toString();
        console.log("OTP has been sent to your register mobile number!");
        res.redirect(`/profile/edit/change/password/otp`);

        // below code is to send actual otp on user mobile

        // // Your Twilio account credentials
        // const accountSid = process.env.TIWILO_ACCOUNT_SID;  // Replace with your Account SID
        // const authToken = process.env.TIWILO_AUTH_TOKEN;    // Replace with your Auth Token
        // const client = new twilio(accountSid, authToken);

        // // Function to generate OTP
        // function generateOTP() {
        //     return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
        // }

        // // Send OTP to the user's phone number
        // async function sendOTP(phoneNumber) {
        //     const otp = generateOTP(); // Generate OTP 

        //     try {
        //         // Send SMS
        //         const message = await client.messages.create({
        //             body: `Your OTP is ${otp} to change skill hub account password`, // Message body with OTP
        //             from: process.env.TIWILO_MOIBLE_NO,         // Your Twilio phone number (replace with yours)
        //             to: phoneNumber              // The user's phone number
        //         });

        //         console.log(`OTP sent to ${phoneNumber}: ${message.sid}`);
        //         return otp; // Return the OTP to store or verify later
        //     } catch (error) {
        //         console.error('Error sending OTP:', error);
        //     }
        // }

        // // Example usage
        // const userPhoneNumber = "+91" + studMobile; // Replace with the user's phone number
        // let smsInfo = sendOTP(userPhoneNumber);
        // smsInfo.then((otp) => {
        //     req.session.sentOtp = otp.toString();
        //     res.redirect(`/profile/edit/change/password/otp`);
        // }).catch((err) => {
        //     console.log(err)
        //     req.session.sentOtp=undefined;
        // res.redirect(`/profile/edit/change/password/otp`);
        // })

    } catch (error) {
        next(error);
    }
}

module.exports = {
    signInForm,
    signUpForm,
    renderUserProfile,
    redirectHomePage,
    renderHomePage,
    renderFilterForm,
    displayFilterResult,
    renderChart,
    sendOtpToChangePassword
} 