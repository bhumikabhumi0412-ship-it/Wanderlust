if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

console.log(process.env.CLOUD_NAME);


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingsRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js');
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStatergy = require('passport-local');
const User = require('./models/user.js');
const ExpressError = require("./util/ExpressError.js");
const dbUrl = process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

let store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

let sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    //cookie defaults
    cookie: {
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        HTTPOnly: true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

passport.use(new LocalStatergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demo", async (req, res) => {
    const fakeUser = new User({
        email: "abc@gmail.com",
        username: "abcd",
    })

    const registeredUser = await User.register(fakeUser, "abcpassword");
    res.send(registeredUser);

});


app.use(listingsRoutes);
app.use(reviewRoutes);
app.use(userRoutes);

//for every link
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { message });
});

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));




// app.get("/testListings", async (req, res) => {
//     let listings = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing.",
//         image: "https://unsplash.com/photos/sunloungers-fronting-buildings-near-mountain-DGa0LQ0yDPc",
//         price: 1200,
//         location: "Sample Location",
//         country: "Sample Country"
//     });
//     await listings.save();
//     res.json(listings);
// });

// error handling middleware
// function asyncWrap(fn) {
//     return function (req, res, next) {
//         fn(req, res, next).catch((err) => next(err));
//     }
// }


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

