const express = require('express');
const STUDENT = require('../models/student');
const PROJECT = require('../models/projects');
const projectControllers = require('../controllers/projectControllers');
const authenticationControllers = require('../controllers/authenticationControllers');
const multer = require('multer');
const storage = require('../cloudinaryConfiguration');
const upload = multer({ storage });
const router = express.Router({ mergeParams: true });

if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

//api to render project form 
//api to save new project info in project database 

router.route('/:studId/new')
.get(projectControllers.createNewProjectForm)
.post(upload.array('projectImgs'), projectControllers.saveNewProjectInfo)

// api to render project view page
 
router.get('/:projectId/view', projectControllers.projectViewPage);

//api to show project images related to that project

router.get('/:projectId/projectImgs', projectControllers.projectImgsGalleryPage);

//api to render project edit form
//api to save edited project info in database

router.route('/:projectId/edit')
.get(projectControllers.projectEditForm)
.put(projectControllers.saveEditedProjectInfo)

//api to render project img edit form

router.get('/:projectId/imgs/edit', projectControllers.editProjectImgsForm);

//api to edit project image

router.post('/:projectId/imgs/:imgNo/edit', upload.single('editedProjectImg'), projectControllers.saveEditedProjectImgs); 

//api to delete project image

router.delete('/:projectId/imgs/:imgNo/edit',projectControllers.destroySingleProjectImg);

//api to destroy project

router.delete('/:projectId/delete', projectControllers.destroyProject);

module.exports = router;  