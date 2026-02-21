const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  cargoWeightKg: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed"],
    default: "Scheduled"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
