const express = require('express');
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { isloggedIn, isOwner, validateListing } = require("../routes/middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


//index route,create route 
router.route("/listings")
    .get(wrapAsync(listingController.index))
    .post(isloggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing))


//new route
router.get("/listings/new", isloggedIn, wrapAsync(listingController.renderNewForm));

//show route,update and delete
router.route("/listings/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isloggedIn, isOwner, validateListing,upload.single('image'), wrapAsync(listingController.updateListing))
    .delete(isloggedIn, isOwner, wrapAsync(listingController.destroyListing))

//edit route
router.get("/listing/:id/edit", isloggedIn,upload.single('image'), isOwner, wrapAsync(listingController.editListing));

router.use((err, req, res, next) => {
    console.log(err);
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { message });
});


module.exports = router;