const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',

        }
    ],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }


});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;