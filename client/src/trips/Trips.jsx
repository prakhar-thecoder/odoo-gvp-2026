import React, { useState, useEffect } from 'react';
import { getTrips, createTrip, updateTripStatus } from './tripsApi';
import { getVehicles } from '../vehicles/vehiclesApi';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setError('');
    setSuccessMessage('');

    if (!vehicleId || !origin || !destination || !cargoWeightKg) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
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
      setSuccessMessage('Trip created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create trip');
    } finally {
      setIsSubmitting(false);
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
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Scheduled
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20">
            {status}
          </span>
        );
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading trips...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sans text-gray-900 tracking-tight">Trips & Dispatch</h1>
        <p className="mt-2 text-sm text-gray-500">Manage ongoing expeditions and launch new fleet routes.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form left */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Create New Trip</h2>
          <form onSubmit={handleCreateTrip} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vehicle</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-500 mb-1">Cargo Weight (kg)</label>
              <input
                type="number"
                value={cargoWeightKg}
                onChange={(e) => setCargoWeightKg(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter weight in kg"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Origin</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter origin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter destination"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Loading...' : 'Create Trip'}
            </button>
          </form>
        </div>

        {/* Table Right */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-x-auto hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Active Map</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 rounded-lg">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Plate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo (kg)</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">No trips created yet</td>
                </tr>
              ) : (
                trips.map(trip => (
                  <tr key={trip._id} className="odd:bg-gray-50 hover:bg-gray-100 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                          className="bg-green-600 text-white rounded-lg px-3 py-1 text-sm font-medium hover:bg-green-700 transition"
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
    </div>
  );
};

export default Trips;
