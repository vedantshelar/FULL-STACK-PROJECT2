const express = require('express');
const profileControllers = require('../controllers/profileControllers');
const authenticationControllers = require('../controllers/authenticationControllers');
const multer = require('multer');
const storage = require('../cloudinaryConfiguration');
const STUDENT = require('../models/student');
const upload = multer({ storage })
const router = express.Router({ mergeParams: true });

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

//api to render profile form 
//api to save new student info

router.route('/new')
    .post(upload.single('studPic'), profileControllers.saveNewStudentInfo);

//api to render profile page corresponds to student id

router.get('/:studId', profileControllers.profilePage);

//api to render edit profile form

router.get('/:studId/edit', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.editProfileForm);

//api to save edited profile pic

router.put('/:studId/edit/profilePic', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, upload.single('studPic'), profileControllers.saveEditedProfilePic);

//api to save edited student basic info

router.put('/:studId/edit/studInfo', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.saveEditedStudentInfo);

//api to save edited language value 

router.put('/:studId/edit/language', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.saveEditedProgrammingLanguage);

//api to save edited skill value 

router.put('/:studId/edit/skill', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.saveEditedSkill)

//api to add programming laguage in student database

router.post('/:studId/programmingLanguages/new', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.addNewProgrammingLanguage);

//api to add skill in student database

router.post('/:studId/skills/new', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.addNewSkill)

//api to save student resume in database

router.post('/:studId/resume/new', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, upload.array("resumeImgs"), profileControllers.saveResume)

//api to edit resume images

router.put('/:studId/resume/edit/img/:imgNo', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, upload.single('resumeImg'), profileControllers.saveEditedResumeImgs)

//api to delete specific resume image

router.delete('/:studId/resume/edit/img/:imgNo', authenticationControllers.isAuthenticated, authenticationControllers.isProfileOwner, profileControllers.destroyResumeImg)

//api to show resume images

router.get('/:studId/resume/view', profileControllers.resumeImgsGalleryPage);

//api to render otp form for changing password

router.get('/edit/change/password/otp', authenticationControllers.isAuthenticated, profileControllers.renderChangePasswordOtpForm);

//api to render change password form

router.get('/edit/change/password', authenticationControllers.isAuthenticated, profileControllers.renderChangePasswordForm);

//api save new password 

router.put('/:studId/edit/password/forget',authenticationControllers.isAuthenticated,profileControllers.saveNewPassword) 

module.exports = router; 