const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing');
const { init } = require('../models/user.js');


main()
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6adb8e50ea1f74b2240d6f98" }));
    await Listing.insertMany(initData.data);
    console.log("Data was inisialized");
    console.log(initData.data[0])
}

initDB();