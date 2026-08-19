const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LostItem = require('../models/LostItem');
const { protect } = require('../middleware/authMiddleware');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/lost-items (Protected)
router.post('/', protect, async (req, res) => {
    try {
        // Attach the logged-in user's ID to the item
        const itemData = { ...req.body, user: req.user.id };
        const newItem = new LostItem(itemData);
        const savedItem = await newItem.save();
        res.status(201).json({ success: true, data: savedItem });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
});

// GET /api/lost-items (Public - Anyone can view)
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) query.category = req.query.category;
        if (req.query.location) query.location = { $regex: req.query.location, $options: 'i' };
        if (req.query.status) query.status = req.query.status;
        if (req.query.itemName) query.itemName = { $regex: req.query.itemName, $options: 'i' };

        const items = await LostItem.find(query).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// GET /api/lost-items/:id (Public)
router.get('/:id', async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    try {
        const item = await LostItem.findById(req.params.id).populate('user', 'name email');
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT /api/lost-items/:id (Protected - Owner only)
router.put('/:id', protect, async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    try {
        let item = await LostItem.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });

        // Ensure user owns the item (Admin bypass logic is handled in adminRoutes)
        if (item.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
        }

        item = await LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Update failed', error: error.message });
    }
});

// DELETE /api/lost-items/:id (Protected - Owner only)
router.delete('/:id', protect, async (req, res) => {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    try {
        const item = await LostItem.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });

        if (item.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
        }

        await item.deleteOne();
        res.status(200).json({ success: true, message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;