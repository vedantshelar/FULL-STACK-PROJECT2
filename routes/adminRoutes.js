const express = require('express');
const indexControllers = require('../controllers/indexControllers');
const adminControlers = require('../controllers/adminControllers');
const router = express.Router({ mergeParams: true });

// api to render user sing up form

router.get('/signup',adminControlers.renderNewAdminForm);
   
// api to save new admin info

router.post('/new',adminControlers.saveNewAdminInfo);

// api to render admin login form

router.get('/signin',adminControlers.renderAdminLoginForm);   

// api to redirect admin home page 

router.post('/signin',adminControlers.loginAdmin);

//api to render admin home page

router.get('/:adminId/home',adminControlers.isAuthenticated,adminControlers.renderAdminHomePage);

//api to sign out admin

router.get('/signout',adminControlers.adminSignOut);

//api to destroy student account

router.delete('/:adminId/:studId/delete',adminControlers.isAuthenticated,adminControlers.destroyStudentAccount);

//api to render admin profile page 

router.get('/profile/:adminId',adminControlers.isAuthenticated,adminControlers.renderAdminProfilePage);

//api to render admin adit profile form

router.get('/profile/:adminId/edit',adminControlers.isAuthenticated,adminControlers.isAdminProfile,adminControlers.rednerEditAdminProfileForm);

//api to save edited admin profile information

router.put('/profile/:adminId/edit',adminControlers.isAuthenticated,adminControlers.isAdminProfile,adminControlers.saveEditedProfileInfo);




module.exports = router; 