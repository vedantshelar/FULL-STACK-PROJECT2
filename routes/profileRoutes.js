const express = require('express');
const profileControllers = require('../controllers/profileControllers');
const multer = require('multer');
const storage = require('../cloudinaryConfiguration');
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

router.get('/:studId/edit', profileControllers.editProfileForm);

//api to save edited profile pic

router.put('/:studId/edit/profilePic', upload.single('studPic'), profileControllers.saveEditedProfilePic);

//api to save edited student basic info

router.put('/:studId/edit/studInfo', profileControllers.saveEditedStudentInfo);

//api to save edited language value 

router.put('/:studId/edit/language', profileControllers.saveEditedProgrammingLanguage);

//api to save edited skill value 

router.put('/:studId/edit/skill', profileControllers.saveEditedSkill)

//api to add programming laguage in student database

router.post('/:studId/programmingLanguages/new', profileControllers.addNewProgrammingLanguage);

//api to add skill in student database

router.post('/:studId/skills/new', profileControllers.addNewSkill)

//api to save student resume in database

router.post('/:studId/resume/new', upload.array("resumeImgs"), profileControllers.saveResume)

//api to edit resume images

router.put('/:studId/resume/edit/img/:imgNo', upload.single('resumeImg'), profileControllers.saveEditedResumeImgs)

//api to delete specific resume image

router.delete('/:studId/resume/edit/img/:imgNo', profileControllers.destroyResumeImg)

//api to show resume images

router.get('/:studId/resume/view', profileControllers.resumeImgsGalleryPage)

module.exports = router; 