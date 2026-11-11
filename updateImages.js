
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Listing = require("./models/listing.js");

async function updateImages() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);

        console.log("Database connected!");

        const imageFolder = path.join(
            __dirname,
            "public",
            "images",
            "listings"
        );

        const images = fs.readdirSync(imageFolder)
            .filter(file => file.toLowerCase().endsWith(".avif"))
            .sort();

        if (images.length !== 50) {
            throw new Error(`Expected 50 AVIF images, found ${images.length}`);
        }

        const locations = [
            "Goa", "Manali", "Jaipur", "Bengaluru", "Mumbai",
            "Udaipur", "Coorg", "Ooty", "Rishikesh", "Munnar"
        ];

        const propertyTypes = [
            "Luxury Villa",
            "Cozy Apartment",
            "Mountain Retreat",
            "Premium Homestay",
            "Private Cottage"
        ];

        const titles = locations.flatMap(city =>
            propertyTypes.map(type => `${type} in ${city}`)
        );

        const listings = await Listing.find({
            title: { $in: titles }
        });

        if (listings.length !== 50) {
            throw new Error(`Expected 50 listings, found ${listings.length}`);
        }

        for (let i = 0; i < listings.length; i++) {
            listings[i].image = {
                filename: images[i],
                url: `/images/listings/${encodeURIComponent(images[i])}`
            };

            await listings[i].save();
        }

        console.log("Images updated successfully!");
        console.log("Listings updated:", listings.length);

    } catch (err) {
        console.error("Image update failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

updateImages();
