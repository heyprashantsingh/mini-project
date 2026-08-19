const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to User
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    dateFound: { type: Date, required: true },
    image: { type: String },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    status: { type: String, enum: ['Found', 'Claimed', 'Returned'], default: 'Found' }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);