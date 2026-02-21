const Vehicle = require('./vehicles.model');

exports.createVehicle = async (req, res) => {
    try {
        const { plateNumber, model, type, maxLoadKg, currentOdometer } = req.body;

        // Basic validation
        if (!plateNumber || !model || !maxLoadKg) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingVehicle = await Vehicle.findOne({ plateNumber });
        if (existingVehicle) {
            return res.status(400).json({ message: 'Duplicate plate number' });
        }

        const vehicle = new Vehicle({ plateNumber, model, type, maxLoadKg, currentOdometer });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
};

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        await Vehicle.findByIdAndDelete(id);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};

exports.updateVehicleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Idle', 'On Trip', 'In Shop'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const vehicle = await Vehicle.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error updating vehicle status', error: error.message });
    }
};
