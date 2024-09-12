const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    id: { type: String, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: String
});

module.exports = mongoose.model('MenuItem', menuItemSchema);