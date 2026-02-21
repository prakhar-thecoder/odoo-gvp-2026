const Vehicle = require('../vehicles/vehicles.model');
const Trip = require('../trips/trips.model');
const Maintenance = require('../maintenance/maintenance.model');

exports.seedDemoData = async (req, res) => {
    try {
        // 1. Create up to 3 demo vehicles if less than 3 exist
        const vehicleCount = await Vehicle.countDocuments();
        const vehiclesNeeded = Math.max(0, 3 - vehicleCount);

        const createdVehicles = [];
        for (let i = 0; i < vehiclesNeeded; i++) {
            const v = await Vehicle.create({
                plateNumber: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
                model: 'Demo Truck A1',
                type: 'Truck',
                maxLoadKg: 5000,
                status: 'Idle'
            });
            createdVehicles.push(v);
        }

        // 2. Fetch all idle vehicles to use for Trip & Maintenance seeding
        const availableVehicles = await Vehicle.find({ status: 'Idle' });

        let tripped = false;
        let serviced = false;

        // Ensure we only create 1 Demo Trip if one doesn't already exist
        const existingDemoTrip = await Trip.findOne({ origin: 'Demo Origin' });
        if (!existingDemoTrip && availableVehicles.length > 0) {
            const driverVehicle = availableVehicles.pop();
            await Trip.create({
                vehicle: driverVehicle._id,
                origin: 'Demo Origin',
                destination: 'Demo Destination',
                cargoWeightKg: 1000,
                status: 'In Progress'
            });
            driverVehicle.status = 'On Trip';
            await driverVehicle.save();
            tripped = true;
        }

        // Ensure we only create 1 Demo Service if one doesn't already exist
        const existingDemoService = await Maintenance.findOne({ serviceType: 'Demo Service' });
        if (!existingDemoService && availableVehicles.length > 0) {
            const serviceVehicle = availableVehicles.pop();
            await Maintenance.create({
                vehicle: serviceVehicle._id,
                serviceType: 'Demo Service',
                description: 'Initial seed inspection',
                cost: 100,
                status: 'In Service'
            });
            serviceVehicle.status = 'In Shop';
            await serviceVehicle.save();
            serviced = true;
        }

        res.json({
            message: 'Demo data seeded successfully',
            details: {
                newVehicles: vehiclesNeeded,
                tripCreated: tripped,
                maintenanceCreated: serviced
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error seeding demo data', error: error.message });
    }
};
