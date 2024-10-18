const express = require('express');
const router = express.Router({ mergeParams: true });
const indexControllers = require('../controllers/indexControllers');
const authenticationControllers = require('../controllers/authenticationControllers');

// api to render sign in form to user

router.get('/signin',indexControllers.signInForm); 

// api to render user profile to singed in user

router.post('/signin',authenticationControllers.loginUser,indexControllers.redirectHomePage); 

// api to render user sing up form

router.get('/signup',indexControllers.signUpForm); 

// api to log out user 

router.get('/signout',authenticationControllers.logoutUser);

//api to render index page 
 
router.get('/home',indexControllers.renderHomePage)
 

module.exports = router;