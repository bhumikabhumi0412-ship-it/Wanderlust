const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding.js');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

};

module.exports.renderNewForm = (req, res) => {
    return res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate(
        {
            path: "review",
            populate: { path: "author" }
        }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you are accessing does not exist!");
        return res.redirect(`/listings`);
    }
    res.render("listings/show.ejs", { listing });
}



module.exports.createListing = async (req, res, next) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        }).send();

        // Check whether Mapbox found the location
        if (!response.body.features.length) {
            req.flash("error", "Location not found!");
            return res.redirect("/listings/new");
        }

        let { title, description, price, location, country } = req.body;

        let newListing = new Listing({
            title,
            description,
            price,
            location,
            country,
            owner: req.user._id,

            image: {
                url: req.file.path,
                filename: req.file.filename
            },

            // Mapbox coordinates: [longitude, latitude]
            geometry: response.body.features[0].geometry
        });

        await newListing.save();

        req.flash("success", "Successfully created new Listing!");
        return res.redirect("/listings");

    } catch (err) {
        next(err);
    }
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    let { title, description, price, location, country } = req.body;

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated Successfully!");

    return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    return res.redirect("/listings");
}
