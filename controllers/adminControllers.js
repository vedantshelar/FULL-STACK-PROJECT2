const STUDENT = require('../models/student');
const TEMPADMIN = require('../models/tempAdmin');
const ADMIN = require('../models/admin');
const bcrypt = require('bcrypt');
const validateAdminSchema = require('../schemaValidators/adminSchemaValidator');
const sendEmail = require('../sendEmail');


const renderNewAdminForm = (req, res) => {
    res.render('createNewAdminForm.ejs');
}

const saveNewTempAdminInfo = async (req, res, next) => {
    try {
        let { error } = validateAdminSchema.validate(req.body);
        if (error) {
            let errorMsg = error.details[0].message;
            req.flash("error", errorMsg);
            res.redirect('/admin/signup');
        } else {
            let adminInfo = new TEMPADMIN(req.body);
            adminInfo = await adminInfo.save();
            if (adminInfo) {
                // req.session.admin = {
                //     adminId: adminInfo._id,
                //     adminType: adminInfo.adminType
                // }
                // req.session.currUser = undefined;
                req.flash('success', 'your account has gone for verification ,you will be notified through your registered email');
                res.redirect('/admin/signin');
            } else {
                req.session.admin = undefined;
                req.flash('error', 'some error occured');
                res.redirect('/admin/signup');
            }
        }
    } catch (error) {
        next(error)
    }
}

const saveNewPermanetAdminInfo = async (req, res, next) => {
    try {
            let tempAdminId = req.params.tempAdminId;
            let superAdminId = req.params.superAdminId;
            let adminType = req.params.adminType;
            let tempAdminInfo = await TEMPADMIN.findById(tempAdminId);
            if(tempAdminInfo){
                if(adminType=="general"){
                    tempAdminInfo.adminType='generalAdmin';
                }else if(adminType=="super"){
                    tempAdminInfo.adminType='superAdmin';
                }else{
                    req.flash('error','something went wrong!');
                    res.redirect(`/admin/profile/${superAdminId}/validateAdminsAccounts`)
                }
                tempAdminInfo = await tempAdminInfo.save();
                let tempAdminData = {
                    adminEmail:tempAdminInfo.adminEmail,
                    adminPassword:tempAdminInfo.adminPassword,
                    adminType:tempAdminInfo.adminType,
                    adminMobileNo:tempAdminInfo.adminMobileNo
                }
                let adminInfo = new ADMIN(tempAdminData);
                adminInfo = await adminInfo.save();
                //deleting temp admin info
                await TEMPADMIN.findByIdAndDelete(tempAdminId);
                if (adminInfo) {
                    let msg = `Congratulation you have got ${adminType} Admin Access For SKILLHUB`;
                    sendEmail(tempAdminData.adminEmail,msg);
                    req.flash('success', `${adminType} type has been granted to admin`);
                    res.redirect(`/admin/profile/${superAdminId}/validateAdminsAccounts`)
                } else {
                    req.session.admin = undefined;
                    req.flash('error', 'some error occured');
                    res.redirect('/admin/signup');
                }
            }else{
                req.flash('error','no such admin data exist in database');
                res.redirect(`/admin/profile/${superAdminId}/validateAdminsAccounts`)
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
                req.flash('success', 'welcome admin')
                res.redirect(`/admin/${adminId}/home`);
            } else {
                req.flash('error', 'wrong password');
                res.redirect('/admin/signin');
            }
        }).catch((err) => {
            next(err);
        })
    } else {
        req.session.admin = undefined;
        req.flash('error', 'You are not authorized!');
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
            req.flash('error', 'invalid admin!')
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
            req.flash('error', 'You are not authenticated');
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
            req.flash('error', 'You are not a owner of this profile');
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
            req.flash('success', 'student account has been permanetly deleted');
            res.redirect(`/admin/${adminId}/home`);
        } else {
            req.flash('error', 'you are not authorized , invalid admin');
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
            req.flash('error', 'admin not found');
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
            req.flash('error', 'admin not found');
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
        req.flash('success', 'admin information has been updated successfully');
        res.redirect(`/admin/profile/${adminId}`);
    } catch (error) {
        next(error);
    }
}

const verifyAdminAccounts = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const tempAdminInfo = await TEMPADMIN.find({});
        res.render("verifyAdminAccountsPage.ejs",{tempAdminInfo:tempAdminInfo});
    } catch (error) {
        next(error);
    }
}

const denyAdminAccess = async (req,res,next)=>{
    try {
        const superAdminId = req.params.superAdminId;
        const tempAdminId = req.params.tempAdminId;   
        let tempAdminInfo = await TEMPADMIN.findByIdAndDelete(tempAdminId);
        if(tempAdminInfo){
            let msg = `Your request for Admin has got rejected by Super Admin for SKILLHUB`;;
            sendEmail(tempAdminInfo.adminEmail,msg);
            req.flash("success","admin access denied!");
            res.redirect(`/admin/profile/${superAdminId}/validateAdminsAccounts`);
        }else{
            req.flash("error","some error occured!");
            res.redirect(`/admin/profile/${superAdminId}/validateAdminsAccounts`);
        }
    } catch (error) {
        next(error);
    }
}

const isSuperAdmin = async (req,res,next)=>{
    if(req.session.admin && req.session.admin.adminType=="superAdmin"){
        next();
    }else{
        const referringUrl = req.get('Referer');
        req.flash("error","your are not authorized!");
        // res.redirect(`/admin/profile/${req.params.adminId}`);
        res.redirect(referringUrl);
    }
}



module.exports = {
    renderNewAdminForm,
    saveNewTempAdminInfo,
    renderAdminLoginForm,
    loginAdmin,
    renderAdminHomePage,
    adminSignOut,
    destroyStudentAccount,
    renderAdminProfilePage,
    rednerEditAdminProfileForm,
    saveEditedProfileInfo,
    isAdminProfile,
    isAuthenticated,
    verifyAdminAccounts,
    saveNewPermanetAdminInfo,
    denyAdminAccess,
    isSuperAdmin
}