const User = require('../models/user.js');

module.exports.signup= (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.renderSignupForm=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username: username });
        let registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.login=(req, res) => {
    res.render("users/login.ejs")
}

module.exports.renderLoginForm=async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl=res.locals.redirect || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Successfully Logged out!");
        res.redirect("/listings");
    }

    )
}