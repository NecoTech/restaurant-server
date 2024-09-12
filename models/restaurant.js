const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bannerImage: String
});

module.exports = mongoose.model('Restaurant', restaurantSchema);