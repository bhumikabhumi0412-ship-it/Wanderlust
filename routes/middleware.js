const Listing = require('../models/listing.js');
const { ListingSchema } = require("../schema.js");
const Review = require('../models/review.js');
const { ReviewSchema } = require("../schema.js");
const ExpressError = require("../util/ExpressError.js");

module.exports.isloggedIn = (req, res, next) => {
    console.log("Path:", req.path);
    console.log("Original URL:", req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirect = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirect) {
        res.locals.redirect = req.session.redirect;
    }
    next();
}

module.exports.isOwner =async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of the listing")
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isAuthor =async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of the review")
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body || {});

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        return next(new ExpressError(400, errMsg));
    }

    next();
};