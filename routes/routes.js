// routes.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const MenuItem = require('../models/menuItem');
const Order = require('../models/order');

// Restaurant routes
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ id: req.params.restaurantId });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/restaurants/sample', async (req, res) => {
    try {
        const sampleRestaurants = [
            { id: "rest001", name: "Pizza Palace", bannerImage: "https://picsum.photos/200/300.jpg" },
            { id: "rest002", name: "Burger Bonanza", bannerImage: "https://picsum.photos/200/400.jpg" },
            { id: "rest003", name: "Sushi Supreme", bannerImage: "https://picsum.photos/200/200.jpg" }
        ];

        const insertedRestaurants = await Restaurant.insertMany(sampleRestaurants);
        res.status(201).json({ message: 'Sample restaurants added successfully', restaurants: insertedRestaurants });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Menu Item routes
router.get('/menu/:restaurantId', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ id: req.params.restaurantId });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/menu/:restaurantId/:category', async (req, res) => {
    try {
        const categoryItems = await MenuItem.find({
            restaurantId: req.params.restaurantId,
            category: req.params.category
        });
        res.json(categoryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/menu/categories/:restaurantId', async (req, res) => {
    try {
        const categories = await MenuItem.distinct('category', { restaurantId: req.params.restaurantId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/menu/sample', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        if (restaurants.length === 0) {
            return res.status(400).json({ message: 'No restaurants found. Please add sample restaurants first.' });
        }

        const sampleItems = restaurants.flatMap(restaurant => [
            {
                id: restaurant.id,
                name: 'Margherita Pizza',
                description: 'Classic tomato and mozzarella pizza',
                price: 10.99,
                category: 'Pizza',
                image: 'https://picsum.photos/200/300.jpg'
            },
            {
                id: restaurant.id,
                name: 'Caesar Salad',
                description: 'Romaine lettuce with Caesar dressing and croutons',
                price: 7.99,
                category: 'Salad',
                image: 'https://picsum.photos/200/200.jpg'
            },
            {
                id: restaurant.id,
                name: 'Spaghetti Bolognese',
                description: 'Spaghetti with meat sauce',
                price: 13.99,
                category: 'Pasta',
                image: 'https://picsum.photos/200/400.jpg'
            },
            {
                id: restaurant.id,
                name: 'Chocolate Cake',
                description: 'Rich chocolate layer cake',
                price: 6.99,
                category: 'Dessert',
                image: 'https://picsum.photos/200/600.jpg'
            },
        ]);

        const insertedItems = await MenuItem.insertMany(sampleItems);
        res.status(201).json({ message: 'Sample menu items added successfully', menuItems: insertedItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Order routes
router.post('/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get orders for a specific restaurant
router.get('/orders/:restaurantId', async (req, res) => {
    try {
        const orders = await Order.find({
            restaurantId: req.params.restaurantId,
            orderStatus: { $ne: 'Completed' }  // Exclude completed orders
        }).sort({ createdAt: 1 });  // Sort by creation time, oldest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark an order as completed
router.patch('/orders/:id/complete', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            { orderStatus: 'Completed' },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;