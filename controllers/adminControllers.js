const STUDENT = require('../models/student');
const ADMIN = require('../models/admin');
const bcrypt = require('bcrypt');


const renderNewAdminForm = (req, res) => {
    res.render('createNewAdminForm.ejs');
}

const saveNewAdminInfo = async (req, res, next) => {
    try {
        let adminInfo = new ADMIN(req.body);
        adminInfo = await adminInfo.save();
        if (adminInfo) {
            req.session.admin = {
                adminId: adminInfo._id,
                adminType: adminInfo.adminType
            }
            req.session.currUser = undefined;
            console.log('admin account has been created successfully');
            res.redirect(`/admin/${adminInfo._id}/home`)
        } else {
            req.session.admin = undefined;
            console.log('')
        }
    } catch (error) {
        next(error)
    }
}

const renderAdminLoginForm = (req, res) => {
    res.render('adminLoginForm.ejs');
}

const loginAdmin = async (req, res, next) => {
    const adminInfo = await ADMIN.findOne({ adminEmail: req.body.adminEmail });
    if (adminInfo) {
        bcrypt.compare(req.body.adminPassword, adminInfo.adminPassword).then(function (result) {
            if (result === true) {
                const adminId = adminInfo._id;
                req.session.admin = {
                    adminId: adminInfo._id,
                    adminType: adminInfo.adminType
                }
                req.session.currUser = undefined;
                console.log('welcome admin')   
                res.redirect(`/admin/${adminId}/home`);
            } else {
                console.log('wrong password');
                res.redirect('/admin/signin');
            }
        }).catch((err) => {
            next(err);
        })
    } else {
        req.session.admin = undefined;
        console.log('something went wrong please try again!');
        res.redirect('/admin/signin');
    }
}


const renderAdminHomePage = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const adminInfo = await ADMIN.findById(adminId);
        if (adminInfo) {
            const studentInfo = await STUDENT.find();
            res.render('index.ejs', { studentInfo: studentInfo });
        } else {
            console.log('invalid admin!')
            res.redirect('/admin/sigin');
        }
    } catch (error) {
        next(error)
    }
}

const adminSignOut = (req, res) => {
    req.session.admin = undefined;
    res.redirect('/admin/signin');
}

const isAuthenticated = async (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        } else {
            console.log('You are not authenticated');
            res.redirect('/admin/signin');
        }
    } catch (error) {
        next(error);
    }
}

const isAdminProfile = async (req, res, next) => {
    try {
        if (req.session.admin.adminId == req.params.adminId) {
            next()
        } else {
            console.log('You are not a owner of this profile');
            res.redirect(`/profile/${adminId}`);

        }
    } catch (error) {
        next(error);
    }
}

const destroyStudentAccount = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const studId = req.params.studId;
        const adminInfo = await ADMIN.findById(adminId);
        if (adminInfo) {
            await STUDENT.findByIdAndDelete(studId);
            res.redirect(`/admin/${adminId}/home`);
        } else {
            console.log('you are not authorized , invalid admin');
            res.redirect('/admin/signout');
        }
    } catch (error) {
        next(error)
    }
}

const renderAdminProfilePage = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const adminInfo = await ADMIN.findById(adminId);
        if (adminInfo) {
            res.render('adminProfile.ejs', { adminInfo });
        } else {
            console.log('admin not found');
            res.redirect(`/admin/profile/${adminId}`);
        }
    } catch (error) {
        next(error);
    }
}

const rednerEditAdminProfileForm = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const adminInfo = await ADMIN.findById(adminId);
        if (adminInfo) {
            res.render('editAdminProfileForm.ejs', { adminInfo });
        } else {
            console.log('admin not found');
            res.redirect(`/admin/profile/${adminId}`);
        }
    } catch (error) {
        next(error);
    }
}

const saveEditedProfileInfo = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const adminInfo = await ADMIN.findById(adminId);
        adminInfo.adminEmail = req.body.adminEmail;
        adminInfo.adminMobileNo = req.body.adminMobileNo;
        await adminInfo.save();
        console.log('admin information has been updated successfully');
        res.redirect(`/admin/profile/${adminId}`);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    renderNewAdminForm,
    saveNewAdminInfo,
    renderAdminLoginForm,
    loginAdmin,
    renderAdminHomePage,
    adminSignOut,
    destroyStudentAccount,
    renderAdminProfilePage,
    rednerEditAdminProfileForm,
    saveEditedProfileInfo,
    isAdminProfile,
    isAuthenticated
}