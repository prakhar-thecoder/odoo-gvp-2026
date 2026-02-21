const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    plateNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    type: { type: String },
    maxLoadKg: { type: Number, required: true },
    currentOdometer: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["Idle", "On Trip", "In Shop"],
        default: "Idle"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
