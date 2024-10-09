const express = require('express');
const STUDENT = require('../models/student');
const PROJECT = require('../models/projects');
const multer = require('multer');
const storage = require('../cloudinaryConfiguration');
const upload = multer({ storage })
const router = express.Router({ mergeParams: true });

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
 
//api to render profile form 

router.get('/new', (req, res) => {
    res.render('createNewProfileForm.ejs');
})

//api to save new student info

router.post('/new', upload.single('studPic'), async (req, res, next) => {
    try {
        req.body.studPic = req.file.path;
        let newStudent = new STUDENT(req.body);
        newStudent = await newStudent.save();
        res.redirect('/profile/new')
    } catch (error) {
        console.log(error);
        next(error);
    }
})

//api to render profile page corresponds to student id

router.get('/:studId', async (req, res) => {
    const studId = req.params.studId;
    const student = await STUDENT.findById(studId).populate("projects", { projectName: 1 });
    res.render('profile.ejs', { student })
})

//api to render edit profile form

router.get('/:studId/edit', async (req, res, next) => {
    try {
        const studentInfo = await STUDENT.findById(req.params.studId).populate("projects");
        res.render('editProfileForm.ejs', { studentInfo });
    } catch (error) {
        next(error);
    }
});

//api to save edited profile pic

router.put('/:studId/edit/profilePic', upload.single('studPic'), async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);

        if (studentInfo) {
            studentInfo.studPic = req.file.path;
            await studentInfo.save();
            console.log("student pic has been changed");
            res.redirect(`/profile/${req.params.studId}/edit`);
        } else {
            console.log("student not found");
            res.redirect(`/profile/${req.params.studId}/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to save edited student basic info

router.put('/:studId/edit/studInfo', async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);

        if (studentInfo) {
            studentInfo.studName = req.body.studName;
            studentInfo.studBranch = req.body.studBranch;
            studentInfo.studCourse = req.body.studCourse;
            studentInfo.studEnrollNo = req.body.studEnrollNo;
            studentInfo.studYear = req.body.studYear;
            await studentInfo.save();
            console.log("student info has been changed");
            res.redirect(`/profile/${req.params.studId}/edit`);
        } else {
            console.log("student not found");
            res.redirect(`/profile/${req.params.studId}/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to save edited language value 

router.put('/:studId/edit/language', async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);
        if (studentInfo) {
            const studId = req.params.studId;
            let languageValue = req.body.language;
            languageValue = languageValue.toUpperCase();

            if (languageValue != "") {
                await STUDENT.findOneAndUpdate({ _id: studId },
                    { $pull: { programmingLanguages: languageValue } })
                console.log(`${languageValue} has been removed from languages option`);
                res.redirect(`/profile/${req.params.studId}/edit`);
            } else {
                console.log(`please enter a language value`);
                res.redirect(`/profile/${req.params.studId}/edit`);
            }
        } else {
            console.log("student not found");
            res.redirect(`/profile/${req.params.studId}/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to save edited skill value 

router.put('/:studId/edit/skill', async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);
        if (studentInfo) {
            const studId = req.params.studId;
            let skillValue = req.body.skill;
            skillValue = skillValue.toUpperCase();

            if (skillValue != "") {
                await STUDENT.findOneAndUpdate({ _id: studId },
                    { $pull: { skills: skillValue } })
                console.log(`${skillValue} has been removed from skills option`);
                res.redirect(`/profile/${req.params.studId}/edit`);
            } else {
                console.log(`please enter a skill value`);
                res.redirect(`/profile/${req.params.studId}/edit`);
            }
        } else {
            console.log("student not found");
            res.redirect(`/profile/${req.params.studId}/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to add programming laguage in student database

router.post('/:studId/programmingLanguages/new', async (req, res, next) => {
    try {
        const studId = req.params.studId;
        if (req.body.languages != "") {
            const student = await STUDENT.findById(studId);
            const language = req.body.languages;
            student.programmingLanguages.push(language);
            await student.save();
            res.redirect(`/profile/${studId}`);
        } else {
            console.log("please enter a programming language !");
            res.redirect(`/profile/${studId}`);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

//api to add skill in student database

router.post('/:studId/skills/new', async (req, res, next) => {
    try {
        const studId = req.params.studId;
        if (req.body.skills != "") {
            const student = await STUDENT.findById(studId);
            const skill = req.body.skills;
            student.skills.push(skill);
            await student.save();
            res.redirect(`/profile/${studId}`);
        } else {
            console.log("please enter a skills !");
            res.redirect(`/profile/${studId}`);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

//api to save student resume in database

router.post('/:studId/resume/new', upload.array("resumeImgs"), async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);
        let files = req.files;
        let studResumeImgs = [];

        if (files.length > 0) {
            for (file of files) {
                studResumeImgs.push(file.path);
            }
        }
        studentInfo.studResume = studResumeImgs;
        await studentInfo.save();
        res.redirect(`/profile/${req.params.studId}`);
    } catch (error) {
        next(error);
    }
})

//api to edit resume images

router.put('/:studId/resume/edit/img/:imgNo', upload.single('resumeImg'), async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);
        if (studentInfo) {
            studentInfo.studResume[req.params.imgNo] = req.file.path;
            await studentInfo.save();
            console.log("resume img " + ((req.params.imgNo) + 1) + " has been changed");
            res.redirect(`/profile/${req.params.studId}/edit`);
        } else {
            console.log("student is invalid");
            res.redirect(`/profile/${req.params.studId}/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to delete specific resume image

router.delete('/:studId/resume/edit/img/:imgNo', async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);
        if (studentInfo) {
            let resumeImgLink = studentInfo.studResume[req.params.imgNo];
            if (resumeImgLink) {
                const studId = req.params.studId;
                await STUDENT.findByIdAndUpdate(studId, { $pull: { studResume: resumeImgLink } });
                console.log("resume " + ((req.params.imgNo) + 1) + " image has been deleted");
                res.redirect(`/profile/${req.params.studId}/edit`);
            } else {
                console.log("resume img is invalid");
                res.redirect(`/profile/${req.params.studId}/edit`);
            }
        } else {
            console.log("student is invalid");
            res.redirect(`/profile/${req.params.studId}/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to show resume images

router.get('/:studId/resume/view', async (req, res, next) => {
    const studId = req.params.studId;
    const studentInfo = await STUDENT.findById(studId, { studResume: 1, _id: 0 });
    resumeImgs = studentInfo.studResume;
    res.render('resumeImgsGallery.ejs', { resumeImgs });
})

module.exports = router; 