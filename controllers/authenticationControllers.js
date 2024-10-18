const STUDENT = require('../models/student');
const PROJECT = require('../models/projects');

const loginUser = async (req, res, next) => {
    try {
        const enrollNo = req.body.enrollNo;
        const password = req.body.password;

        const studentInfo = await STUDENT.findOne({ studEnrollNo: enrollNo, password: password });

        if (studentInfo) {
            req.session.currUser = {
                studId: studentInfo._id,
                studEnrollNo: studentInfo.studEnrollNo
            }
            console.log("user has been log in"); 
            next();
        } else {
            console.log('wrong user credentials');
            res.redirect('/signin');
        }
    } catch (error) {
        next(error);
    }
}

const logoutUser = async (req,res,next)=>{
    try {
        if(req.session.currUser){
            req.session.currUser = undefined;
            console.log("user has been log out");
            res.redirect('/home');
        }
    } catch (error) {
        next(error); 
    }
}

const isAuthenticated = (req,res)=>{
    if(req.session.currUser){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    loginUser,
    logoutUser,
    isAuthenticated
}