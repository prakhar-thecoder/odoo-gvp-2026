const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    serviceType: { type: String, required: true },
    description: { type: String },
    cost: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["In Service", "Completed"],
        default: "In Service"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
