const Vehicle = require('../vehicles/vehicles.model');
const Trip = require('../trips/trips.model');
const Maintenance = require('../maintenance/maintenance.model');

exports.getDashboardSummary = async (req, res) => {
    try {
        // Run aggregations concurrently for performance
        const [
            totalVehicles,
            idleVehicles,
            onTripVehicles,
            inShopVehicles,

            totalTrips,
            activeTrips,
            completedTrips,
            recentTrips,

            totalMaintenance,
            ongoingMaintenance
        ] = await Promise.all([
            // Vehicles
            Vehicle.countDocuments(),
            Vehicle.countDocuments({ status: 'Idle' }),
            Vehicle.countDocuments({ status: 'On Trip' }),
            Vehicle.countDocuments({ status: 'In Shop' }),

            // Trips
            Trip.countDocuments(),
            Trip.countDocuments({ status: { $ne: 'Completed' } }),
            Trip.countDocuments({ status: 'Completed' }),
            // Recent Trips logic (limit 5, sorted by latest)
            Trip.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('vehicle', 'plateNumber')
                .select('origin destination status vehicle createdAt'),

            // Maintenance
            Maintenance.countDocuments(),
            Maintenance.countDocuments({ status: 'In Service' })
        ]);

        // Construct cleaner JSON response
        const summary = {
            totalVehicles,
            idleVehicles,
            onTripVehicles,
            inShopVehicles,

            totalTrips,
            activeTrips,
            completedTrips,

            totalMaintenance,
            ongoingMaintenance,

            recentTrips
        };

        res.json(summary);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary', error: error.message });
    }
};
