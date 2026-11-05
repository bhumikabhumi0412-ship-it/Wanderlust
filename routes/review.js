const express = require('express');
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { ReviewSchema } = require("../schema.js");
const ExpressError = require("../util/ExpressError.js");
const { validateReview} = require("../routes/middleware.js");
const { isloggedIn,isAuthor} = require("../routes/middleware.js");
const reviewController=require("../controllers/reviews.js")


router.delete(
    "/listings/:id/review/:reviewId",
    isloggedIn,
    isAuthor,
    wrapAsync(reviewController.destroyReview)
);



router.post(
    "/listings/:id/review",
    isloggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// error handling middleware
// error handling middleware
router.use((err, req, res, next) => {
    console.log(err);

    const { status = 500, message = "Something went wrong!" } = err;

    res.status(status).render("listings/error.ejs", { message });
});

module.exports = router;