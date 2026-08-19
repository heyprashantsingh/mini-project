const express = require('express');
const router = express.Router();
const User = require('../models/User');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const { protect, admin } = require('../middleware/authMiddleware');

// ALL ROUTES HERE RUN THROUGH THE ADMIN GATEKEEPER
router.use(protect, admin); 

// --- DASHBOARD STATS ---
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLost = await LostItem.countDocuments();
        const totalFound = await FoundItem.countDocuments();
        const claimedLost = await LostItem.countDocuments({ status: 'Claimed' });
        const returnedFound = await FoundItem.countDocuments({ status: 'Returned' });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalReports: totalLost + totalFound,
                totalLost,
                totalFound,
                resolvedReports: claimedLost + returnedFound
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- MANAGE USERS ---
router.get('/users', async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
});

router.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
});

// --- MANAGE ITEMS (Force Update/Delete) ---
router.put('/lost-items/:id', async (req, res) => {
    const item = await LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, data: item });
});

router.delete('/lost-items/:id', async (req, res) => {
    const item = await LostItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, message: 'Lost Item deleted by Admin' });
});

router.put('/found-items/:id', async (req, res) => {
    const item = await FoundItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, data: item });
});

router.delete('/found-items/:id', async (req, res) => {
    const item = await FoundItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, message: 'Found Item deleted by Admin' });
});

module.exports = router;