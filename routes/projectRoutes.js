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

//api to render project form 

router.get('/:studId/new', (req, res) => { 
    res.locals.studId = req.params.studId;
    res.render('createNewProjectForm.ejs');
})

//api to save new project info in project database 

router.post('/:studId/new', upload.array('projectImgs'), async (req, res, next) => {
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

router.get('/:projectId/view', async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
        const projectInfo = await PROJECT.findById(projectId).populate("owner", { studName: 1, _id: 0 });
        res.render('projectView.ejs', { projectInfo });
    } catch (error) {
        next(error);
    }
});

//api to show project images related to that project

router.get('/:projectId/projectImgs', async (req, res, next) => {
    const projectId = req.params.projectId;
    const projectImages = await PROJECT.findById(projectId, { projectImgs: 1, _id: 0 });
    res.render('projectImgsGallery.ejs', { projectImages });
})

//api to render project edit form

router.get('/:projectId/edit', async (req, res, next) => {
    try {
        const projectInfo = await PROJECT.findById(req.params.projectId);
        res.render("projectEditForm.ejs", { projectInfo });
    } catch (error) {
        next(error);
    }
});

//api to save edited project info in database

router.put('/:projectId/edit', async (req, res, next) => {
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

router.get('/:projectId/imgs/edit', async (req, res, next) => {
    try {
        const projectInfo = await PROJECT.findById(req.params.projectId);
        res.render("editProjectImgsForm.ejs", { projectInfo });
    } catch (error) {
        next(error);
    }
});

//api to edit project image

router.post('/:projectId/imgs/:imgNo/edit', upload.single('editedProjectImg'), async (req, res, next) => {
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

router.delete('/:projectId/delete', async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const projectInfo = await PROJECT.findByIdAndDelete(projectId);
        console.log("project has been destroyed");
        res.redirect(`/profile/${projectInfo.owner}/edit`)
    } catch (error) {
        next(error);
    }
})

module.exports = router;