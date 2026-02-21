const Maintenance = require('./maintenance.model');
const Vehicle = require('../vehicles/vehicles.model');

// Handle creation and related vehicle state update
exports.createMaintenance = async (req, res) => {
    try {
        const { vehicleId, serviceType, description, cost } = req.body;

        // Verify vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Create log
        const newMaintenance = new Maintenance({
            vehicle: vehicleId,
            serviceType,
            description,
            cost
        });
        await newMaintenance.save();

        // Update vehicle status
        vehicle.status = 'In Shop';
        await vehicle.save();

        // Populate and return
        const populatedMaintenance = await newMaintenance.populate('vehicle', 'plateNumber');
        res.status(201).json(populatedMaintenance);
    } catch (error) {
        res.status(500).json({ message: 'Error creating maintenance record', error: error.message });
    }
};

// Fetch all logs
exports.getMaintenanceLogs = async (req, res) => {
    try {
        const logs = await Maintenance.find().populate('vehicle', 'plateNumber').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance records', error: error.message });
    }
};

// Update status and related vehicle state
exports.updateMaintenanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== 'Completed') {
            return res.status(400).json({ message: 'Can only update status to Completed' });
        }

        const maintenance = await Maintenance.findById(id);
        if (!maintenance) {
            return res.status(404).json({ message: 'Maintenance record not found' });
        }

        if (maintenance.status === 'Completed') {
            return res.status(400).json({ message: 'Log is already completed' });
        }

        // Update log
        maintenance.status = 'Completed';
        await maintenance.save();

        // Update vehicle
        const vehicle = await Vehicle.findById(maintenance.vehicle);
        if (vehicle) {
            vehicle.status = 'Idle';
            await vehicle.save();
        }

        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ message: 'Error updating maintenance status', error: error.message });
    }
};
