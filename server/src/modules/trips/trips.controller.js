const Trip = require('./trips.model');
const Vehicle = require('../vehicles/vehicles.model');

exports.createTrip = async (req, res) => {
    try {
        const { vehicleId, origin, destination, cargoWeightKg } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(400).json({ message: 'Vehicle not found' });
        }

        if (vehicle.status !== 'Idle') {
            return res.status(400).json({ message: 'Vehicle is not Idle' });
        }

        if (cargoWeightKg > vehicle.maxLoadKg) {
            return res.status(400).json({ message: 'Cargo weight exceeds vehicle max load' });
        }

        const trip = new Trip({
            vehicle: vehicleId,
            origin,
            destination,
            cargoWeightKg
        });

        await trip.save();

        vehicle.status = 'On Trip';
        await vehicle.save();

        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Error creating trip', error: error.message });
    }
};

exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('vehicle', 'plateNumber');
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
};

exports.updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        trip.status = status;
        await trip.save();

        if (status === 'Completed') {
            const vehicle = await Vehicle.findById(trip.vehicle);
            if (vehicle) {
                vehicle.status = 'Idle';
                await vehicle.save();
            }
        }

        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Error updating trip status', error: error.message });
    }
};
