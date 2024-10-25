const STUDENT = require('../models/student');

const createNewProfileForm = (req, res) => {
    res.render('createNewProfileForm.ejs');
}

const saveNewStudentInfo = async (req, res, next) => {
    try {
        req.body.studPic = req.file.path;
        let newStudent = new STUDENT(req.body);
        newStudent = await newStudent.save();
        if (newStudent) {
            req.session.currUser = {
                studId: newStudent._id,
                studEnrollNo: newStudent.studEnrollNo
            }
            res.redirect(`/profile/${newStudent._id}`);
        } else {
            console.log("failed to create new account try again");
            res.redirect('/signup');
        }
    } catch (error) {
        next(error);
    }
}


const profilePage = async (req, res) => {
    const studId = req.params.studId;
    const student = await STUDENT.findById(studId).populate("projects", { projectName: 1 });
    res.render('profile.ejs', { student })
}

const editProfileForm = async (req, res, next) => {
    try {
        const studentInfo = await STUDENT.findById(req.params.studId).populate("projects");
        res.render('editProfileForm.ejs', { studentInfo });
    } catch (error) {
        next(error);
    }
}

const saveEditedProfilePic = async (req, res, next) => {
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
}

const saveEditedStudentInfo = async (req, res, next) => {
    try {
        let studentInfo = await STUDENT.findById(req.params.studId);

        if (studentInfo) {
            studentInfo.studName = req.body.studName;
            studentInfo.studMobile = req.body.studMobile;
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
}

const saveEditedProgrammingLanguage = async (req, res, next) => {
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
}

const saveEditedSkill = async (req, res, next) => {
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
}

const addNewProgrammingLanguage = async (req, res, next) => {
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
}

const addNewSkill = async (req, res, next) => {
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
};

const saveResume = async (req, res, next) => {
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
}

const saveEditedResumeImgs = async (req, res, next) => {
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
}

const destroyResumeImg = async (req, res, next) => {
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
}

const resumeImgsGalleryPage = async (req, res, next) => {
    const studId = req.params.studId;
    const studentInfo = await STUDENT.findById(studId, { studResume: 1, _id: 0 });
    resumeImgs = studentInfo.studResume;
    res.render('resumeImgsGallery.ejs', { resumeImgs });
}

const renderChangePasswordOtpForm = async (req, res, next) => {
    if (req.session.sentOtp) {
        res.locals.sentOtp = req.session.sentOtp;
        req.session.sentOtp = undefined;
    } else {
        console.log('req.session not present');
        res.locals.sentOtp = undefined;
    }
    res.render('changePasswordOtpForm.ejs');
};

const renderChangePasswordForm = async (req, res, next) => {
    try {
        res.render('changePasswordForm.ejs');
    } catch (error) {
        next(error);
    } 
};

const saveNewPassword = async (req, res, next) => {
    try {
        const studId = req.params.studId;
        const studentInfo = await STUDENT.findById(studId);
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        if (studentInfo.password === oldPassword) {
            studentInfo.password = newPassword;
            await studentInfo.save();
            console.log('password has been changed successfully!');
            res.redirect(`/profile/${studId}/edit`);
        } else {
            console.log('invalid old password!');
            res.redirect('/profile/edit/change/password');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNewProfileForm,
    saveNewStudentInfo,
    profilePage,
    editProfileForm,
    saveEditedProfilePic,
    saveEditedStudentInfo,
    saveEditedProgrammingLanguage,
    saveEditedSkill,
    addNewProgrammingLanguage,
    addNewSkill,
    saveResume,
    saveEditedResumeImgs,
    destroyResumeImg,
    resumeImgsGalleryPage,
    renderChangePasswordOtpForm,
    renderChangePasswordForm,
    saveNewPassword
} 