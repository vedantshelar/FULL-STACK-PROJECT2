const STUDENT = require('../models/student');
const PROJECT = require('../models/projects');

const signInForm = (req,res)=>{
    res.render('signInForm.ejs');
}

const signUpForm = (req,res)=>{
    res.render('createNewProfileForm.ejs');
}

const renderUserProfile = (req,res)=>{
    const studId = req.session.currUser.studId;
    res.redirect(`/profile/${studId}`);
}

const redirectHomePage = (req,res)=>{
    res.redirect('/home');
}

const renderHomePage = async(req, res) => {
    const studentInfo = await STUDENT.find().populate("projects");
    res.render('index.ejs',{studentInfo});
}

module.exports = {
    signInForm,
    signUpForm,
    renderUserProfile,
    redirectHomePage,
    renderHomePage
} 