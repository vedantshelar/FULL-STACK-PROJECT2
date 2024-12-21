const express = require('express');
const indexControllers = require('../controllers/indexControllers');
const adminControlers = require('../controllers/adminControllers');
const router = express.Router({ mergeParams: true });

// api to render user sing up form

router.get('/signup',adminControlers.renderNewAdminForm);
   
// api to save new admin info

router.post('/new',adminControlers.saveNewTempAdminInfo);

// api to render admin login form

router.get('/signin',adminControlers.renderAdminLoginForm);   

// api to redirect admin home page 

router.post('/signin',adminControlers.loginAdmin);

//api to render admin home page

router.get('/:adminId/home',adminControlers.isAuthenticated,adminControlers.renderAdminHomePage);

//api to sign out admin

router.get('/signout',adminControlers.adminSignOut);

//api to destroy student account

router.delete('/:adminId/:studId/delete',adminControlers.isAuthenticated,adminControlers.isSuperAdmin,adminControlers.destroyStudentAccount);

//api to render admin profile page 

router.get('/profile/:adminId',adminControlers.isAuthenticated,adminControlers.renderAdminProfilePage);

//api to render admin edit profile form

router.get('/profile/:adminId/edit',adminControlers.isAuthenticated,adminControlers.isAdminProfile,adminControlers.rednerEditAdminProfileForm);

//api to save edited admin profile information

router.put('/profile/:adminId/edit',adminControlers.isAuthenticated,adminControlers.isAdminProfile,adminControlers.saveEditedProfileInfo);

//api to verify admin accounts

router.get('/profile/:adminId/validateAdminsAccounts',adminControlers.isAuthenticated,adminControlers.isSuperAdmin,adminControlers.verifyAdminAccounts);

//api to denied admin access

router.get('/:superAdminId/verify/admin/:tempAdminId/reject',adminControlers.isSuperAdmin,adminControlers.denyAdminAccess);

//api to give access to admin as general or super
 
router.get('/:superAdminId/verify/admin/:tempAdminId/:adminType',adminControlers.isAuthenticated,adminControlers.saveNewPermanetAdminInfo);

module.exports = router; 