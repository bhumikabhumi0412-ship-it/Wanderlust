const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../routes/middleware.js");
const userController=require("../controllers/users.js")

router.route("/signup")
.get(userController.signup)
.post(wrapAsync(userController.renderSignupForm))

router.route("/login")
.get( userController.login)
.post(saveRedirectUrl, 
    passport.authenticate("local",
         { failureRedirect: "/login", 
           failureFlash: true }),
    userController.renderLoginForm);

//log-out
router.get("/logout", userController.logout);

module.exports = router;