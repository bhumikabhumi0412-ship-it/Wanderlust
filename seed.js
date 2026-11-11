
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

// Connect to your existing database
const dbUrl = process.env.ATLASDB_URL;

const destinations = [
    { city: "Goa", country: "India", coordinates: [73.8567, 15.4909] },
    { city: "Manali", country: "India", coordinates: [77.1892, 32.2432] },
    { city: "Jaipur", country: "India", coordinates: [75.7873, 26.9124] },
    { city: "Bengaluru", country: "India", coordinates: [77.5946, 12.9716] },
    { city: "Mumbai", country: "India", coordinates: [72.8777, 19.0760] },
    { city: "Udaipur", country: "India", coordinates: [73.7125, 24.5854] },
    { city: "Coorg", country: "India", coordinates: [75.7382, 12.3375] },
    { city: "Ooty", country: "India", coordinates: [76.6950, 11.4102] },
    { city: "Rishikesh", country: "India", coordinates: [78.2676, 30.0869] },
    { city: "Munnar", country: "India", coordinates: [77.0595, 10.0889] }
];

const propertyTypes = [
    {
        name: "Luxury Villa",
        description: "Experience luxury and comfort in this beautiful villa with spacious rooms and modern amenities.",
        price: 4500
    },
    {
        name: "Cozy Apartment",
        description: "A comfortable apartment perfect for couples and small families looking for a relaxing stay.",
        price: 2200
    },
    {
        name: "Mountain Retreat",
        description: "Enjoy peaceful surroundings, beautiful views and a refreshing escape from city life.",
        price: 3500
    },
    {
        name: "Premium Homestay",
        description: "Enjoy a homely atmosphere with excellent hospitality and all essential facilities.",
        price: 1800
    },
    {
        name: "Private Cottage",
        description: "A beautiful private cottage offering privacy, comfort and a memorable holiday experience.",
        price: 3000
    }
];

const images = [
    "https://images.unsplash.com/photo-1600594552184-7a6e8b6e7b4a",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
];

const reviewComments = [
    "Amazing place! The property was clean and comfortable.",
    "Had a wonderful stay. The location was beautiful.",
    "Excellent hospitality. Would definitely visit again.",
    "The rooms were spacious and the experience was fantastic.",
    "Very peaceful place. Perfect for a family vacation.",
    "Loved the ambience and the overall experience.",
    "Great property with excellent facilities.",
    "Everything was perfect. Highly recommended!",
    "Beautiful stay and friendly host.",
    "Value for money. Had a memorable experience."
];

async function seedDatabase() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Database connected!");

        // Get existing registered users
        const users = await User.find({});

        if (users.length === 0) {
            throw new Error("Please register at least one user before running seed.js");
        }

        // Avoid adding duplicate listings when running again
        const existingTitles = new Set(await Listing.distinct("title"));

        let listingCount = 0;
        let reviewCount = 0;

        for (let i = 0; i < destinations.length; i++) {

            for (let j = 0; j < propertyTypes.length; j++) {

                const destination = destinations[i];
                const property = propertyTypes[j];

                const title = `${property.name} in ${destination.city}`;

                if (existingTitles.has(title)) {
                    continue;
                }

                // Small coordinate offsets for demo map markers
                const coordinates = [
                    destination.coordinates[0] + j * 0.002,
                    destination.coordinates[1] + j * 0.002
                ];

                const owner = users[i % users.length];

                const listing = new Listing({
                    title: title,

                    description: property.description,

                    image: {
                        filename: "wanderlust-demo",
                        url: images[i]
                    },

                    price: property.price + (i * 100),

                    location: destination.city,

                    country: destination.country,

                    owner: owner._id,

                    geometry: {
                        type: "Point",
                        coordinates: coordinates
                    },

                    review: []
                });

                await listing.save();

                listingCount++;

                // Generate 3 reviews for each listing
                for (let k = 0; k < 3; k++) {

                    const reviewer = users[(i + j + k) % users.length];

                    const review = new Review({
                        comment: reviewComments[(i + j + k) % reviewComments.length],

                        rating: 5 - (k % 3),

                        author: reviewer._id
                    });

                    await review.save();

                    listing.review.push(review._id);

                    reviewCount++;
                }

                await listing.save();

                existingTitles.add(title);

                console.log("Added:", title);
            }
        }

        console.log("--------------------------------");
        console.log("Seeding completed!");
        console.log("New listings:", listingCount);
        console.log("New reviews:", reviewCount);
        console.log("--------------------------------");

    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        await mongoose.connection.close();
    }
}

seedDatabase();
