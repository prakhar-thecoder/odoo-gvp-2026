import React, { useState, useEffect } from 'react';
import { getTrips, createTrip, updateTripStatus } from './tripsApi';
import { getVehicles } from '../vehicles/vehiclesApi';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [vehicleId, setVehicleId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoWeightKg, setCargoWeightKg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData] = await Promise.all([
        getTrips(),
        getVehicles()
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!vehicleId || !origin || !destination || !cargoWeightKg) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await createTrip({
        vehicleId,
        origin,
        destination,
        cargoWeightKg: Number(cargoWeightKg)
      });

      // Reset form
      setVehicleId('');
      setOrigin('');
      setDestination('');
      setCargoWeightKg('');

      // Refresh list
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    }
  };

  const handleCompleteTrip = async (id) => {
    try {
      await updateTripStatus(id, 'Completed');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to complete trip');
    }
  };

  const idleVehicles = vehicles.filter(v => v.status === 'Idle');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Scheduled</span>;
      case 'In Progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">In Progress</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) return <div className="p-4">Loading trips...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trips / Dispatch</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Trip</h2>
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select a vehicle</option>
                {idleVehicles.map(v => (
                  <option key={v._id} value={v._id}>
                    {v.plateNumber} (Max Load: {v.maxLoadKg}kg)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Weight (kg)</label>
              <input
                type="number"
                value={cargoWeightKg}
                onChange={(e) => setCargoWeightKg(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter weight in kg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter origin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter destination"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Trip
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Plate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo (kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trips.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No trips found</td>
              </tr>
            ) : (
              trips.map(trip => (
                <tr key={trip._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trip.vehicle ? trip.vehicle.plateNumber : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.origin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.cargoWeightKg}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(trip.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {trip.status !== 'Completed' && (
                      <button
                        onClick={() => handleCompleteTrip(trip._id)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;
