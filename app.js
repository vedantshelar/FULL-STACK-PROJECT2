if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = new express();
const STUDENT = require('./models/student');
const PROJECT = require('./models/projects');
const multer = require('multer');
const storage = require('./cloudinaryConfiguration');

const upload = multer({ storage })

app.listen(3000, () => {
    console.log("server is listening to port 3000");
})

// database connection

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/SKILLHUB');
}

main().then(() => {
    console.log("database is connected successfully");
}).catch(() => {
    console.log("error while connecting to database");
})

// middlewares

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(cookieParser('skillhubweb'));
app.use(session({
    secret: 'skillhubweb',
    resave: false,
    saveUninitialized: true
}))

//api to render index page

app.get('/home', (req, res) => {
    res.render('index.ejs');
})

//api to render profile form

app.get('/profile/new', (req, res) => {
    res.render('createNewProfileForm.ejs');
})

//api to save new student info

app.post('/profile/new', upload.single('studPic'), async (req, res, next) => {
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

app.get('/profile/:studId', async (req, res) => {
    const studId = req.params.studId;
    const student = await STUDENT.findById(studId).populate("projects", { projectName: 1 });
    res.render('profile.ejs', { student })
})


//api to render edit profile form

app.get('/profile/:studId/edit', async (req, res, next) => {
    try {
        const studentInfo = await STUDENT.findById(req.params.studId).populate("projects");
        res.render('editProfileForm.ejs', { studentInfo });
    } catch (error) {
        next(error);
    }
});

//api to save edited profile pic

app.put('/profile/:studId/edit/profilePic', upload.single('studPic'), async (req, res, next) => {
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

app.put('/profile/:studId/edit/studInfo', async (req, res, next) => {
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

app.put('/profile/:studId/edit/language', async (req, res, next) => {
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

app.put('/profile/:studId/edit/skill', async (req, res, next) => {
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

app.post('/profile/:studId/programmingLanguages/new', async (req, res, next) => {
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

app.post('/profile/:studId/skills/new', async (req, res, next) => {
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

//api to upload resume  

// app.post('/profile/:studId/resume', upload.single('studResume'), async (req, res, next) => {
//     try {
//         console.log(req.file);

//         const studId = req.params.studId;
//         const studResume = req.file.path;
//         const student = await STUDENT.findById(studId);
//         student.studResume = studResume;
//         await student.save();
//         console.log(req.file);
//         console.log("resume has been uploaded successfully");
//         res.redirect(`/profile/${studId}`);
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// })

//api to save student resume in database

app.post('/profile/:studId/resume/new', upload.array("resumeImgs"), async (req, res, next) => {
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

//api to show resume images

app.get('/profile/:studId/resume/view', async (req, res, next) => {
    const studId = req.params.studId;
    const studentInfo = await STUDENT.findById(studId, { studResume: 1, _id: 0 });
    resumeImgs = studentInfo.studResume;
    res.render('resumeImgsGallery.ejs', { resumeImgs });
}) 

//api to render project form 

app.get('/project/:studId/new', (req, res) => {
    res.locals.studId = req.params.studId;
    res.render('createNewProjectForm.ejs');
})


//api to save new project info in project database 

app.post('/project/:studId/new', upload.array('projectImgs'), async (req, res, next) => {
    const studId = req.params.studId;
    try {
        const files = req.files;
        let projectImgArray = [];

        if (files.length > 0) {
            for (file of files) {
                projectImgArray.push(file.path);
            }
            req.body.projectImgs = projectImgArray;
        } else {
            req.body.projectImgs = [];
        }
        req.body.owner = studId;
        let newProjectInfo = new PROJECT(req.body);
        await newProjectInfo.save();
        let studentInfo = await STUDENT.findById(studId);
        studentInfo.projects.push(newProjectInfo._id);
        await studentInfo.save();
        console.log("new project info has been saved");
        res.redirect(`/profile/${studId}`);
    } catch (error) {
        console.log(error);
        next(error);
    } 

})

// api to render project view page

app.get('/project/:projectId/view', async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
        const projectInfo = await PROJECT.findById(projectId).populate("owner", { studName: 1, _id: 0 });
        res.render('projectView.ejs', { projectInfo });
    } catch (error) {
        next(error);
    }
});

//api to show project images related to that project

app.get('/project/:projectId/projectImgs', async (req, res, next) => {
    const projectId = req.params.projectId;
    const projectImages = await PROJECT.findById(projectId, { projectImgs: 1, _id: 0 });
    res.render('projectImgsGallery.ejs', { projectImages });
})

//api to render project edit form

app.get('/project/:projectId/edit', async (req, res, next) => {
    try {
        const projectInfo = await PROJECT.findById(req.params.projectId);
        res.render("projectEditForm.ejs", { projectInfo });
    } catch (error) {
        next(error);
    }
});

//api to save edited project info in database

app.put('/project/:projectId/edit', async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        let projectInfo = await PROJECT.findById(projectId);
        projectInfo.projectName = req.body.projectName;
        projectInfo.projectDescription = req.body.projectDescription;
        projectInfo.projetGitHubLink = req.body.projetGitHubLink;
        await projectInfo.save();
        console.log("project info has been edited");
        res.redirect(`/project/${projectId}/edit`);
    } catch (error) {
        next(error);
    }
});

//api to render project img edit form

app.get('/project/:projectId/imgs/edit', async (req, res, next) => {
    try {
        const projectInfo = await PROJECT.findById(req.params.projectId);
        res.render("editProjectImgsForm.ejs", { projectInfo });
    } catch (error) {
        next(error);
    }
});

//api to edit project image

app.post('/project/:projectId/imgs/:imgNo/edit', upload.single('editedProjectImg'), async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const imgNo = req.params.imgNo;
        if (req.file) {
            let projectInfo = await PROJECT.findById(projectId, { projectImgs: 1 });
            projectInfo.projectImgs[imgNo] = req.file.path;
            await projectInfo.save();
            res.redirect(`/project/${projectId}/imgs/edit`);
        } else {
            console.log("please select image");
            res.redirect(`/project/${projectId}/imgs/edit`);
        }
    } catch (error) {
        next(error);
    }
})

//api to destroy project
 
app.delete('/project/:projectId/delete',async(req,res,next)=>{
    try {
        const projectId = req.params.projectId;
        const projectInfo = await PROJECT.findByIdAndDelete(projectId);
        console.log("project has been destroyed");
        res.redirect(`/profile/${projectInfo.owner}/edit`)
    } catch (error) {
        next(error);
    }  
})


// ERROR HANDLING MIDDLEWARE 

app.use(async (err, req, res, next) => {
    console.log(err);
    res.send("error");
})