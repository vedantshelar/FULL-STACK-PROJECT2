const STUDENT = require('../models/student');
const PROJECT = require('../models/projects');


const createNewProjectForm = (req, res) => {
    res.locals.studId = req.params.studId;
    res.render('createNewProjectForm.ejs');
}

const saveNewProjectInfo = async (req, res, next) => {
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

}

const projectViewPage = async (req, res, next) => {
    const projectId = req.params.projectId;
    try {
        const projectInfo = await PROJECT.findById(projectId).populate("owner", { studName: 1, _id: 0 });
        res.render('projectView.ejs', { projectInfo });
    } catch (error) {
        next(error);
    }
}

const projectImgsGalleryPage = async (req, res, next) => {
    const projectId = req.params.projectId;
    const projectImages = await PROJECT.findById(projectId, { projectImgs: 1, _id: 0 });
    res.render('projectImgsGallery.ejs', { projectImages });
}

const projectEditForm = async (req, res, next) => {
    try {
        const projectInfo = await PROJECT.findById(req.params.projectId);
        res.render("projectEditForm.ejs", { projectInfo });
    } catch (error) {
        next(error);
    }
}

const saveEditedProjectInfo = async (req, res, next) => {
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
}

const editProjectImgsForm = async (req, res, next) => {
    try {
        const projectInfo = await PROJECT.findById(req.params.projectId);
        res.render("editProjectImgsForm.ejs", { projectInfo });
    } catch (error) {
        next(error);
    }
}

const saveEditedProjectImgs = async (req, res, next) => {
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
}

const destroySingleProjectImg = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const imgNo = req.params.imgNo;
        let projectInfo = await PROJECT.findById(projectId, { projectImgs: 1 });
        const projectImgToBeDeleted = projectInfo.projectImgs[imgNo];
        projectInfo = await PROJECT.findByIdAndUpdate(projectId, { $pull: { projectImgs: projectImgToBeDeleted } });
        await projectInfo.save();
        if (projectInfo) {
            console.log(`${imgNo + 1} project image has been deleted`);
            res.redirect(`/project/${projectId}/imgs/edit`);
        } else {
            console.log(`some problem coming while deleting project image ${imgNo}`);
            res.redirect(`/project/${projectId}/imgs/edit`);
        }
    } catch (error) {
        next(error);
    }
}

const destroyProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const projectInfo = await PROJECT.findByIdAndDelete(projectId);
        // const studId = projectInfo.owner;
        // const studentInfo = await STUDENT.findById(studId);
        // console.log(studentInfo) 
        // if (studentInfo) {
        //     await STUDENT.findByIdAndUpdate(studId, { $pull: { projects: projectId } });
        // }
        console.log("project has been destroyed");
        res.redirect(`/profile/${projectInfo.owner}/edit`)
    } catch (error) {
        next(error); 
    }
} 

module.exports = {
    createNewProjectForm: createNewProjectForm,
    saveNewProjectInfo: saveNewProjectInfo,
    projectViewPage: projectViewPage,
    projectImgsGalleryPage: projectImgsGalleryPage,
    projectEditForm: projectEditForm,
    saveEditedProjectInfo: saveEditedProjectInfo,
    editProjectImgsForm: editProjectImgsForm,
    saveEditedProjectImgs: saveEditedProjectImgs,
    destroyProject: destroyProject,
    destroySingleProjectImg: destroySingleProjectImg
}