import React, { useState, useEffect } from 'react';
import { fetchDashboardSummary, seedDemoData } from './dashboardApi';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      setSeedMessage('');
      setError(null);

      const res = await seedDemoData();
      setSeedMessage(res.message || 'Demo data loaded successfully!');

      // Clear message after 3 seconds
      setTimeout(() => setSeedMessage(''), 3000);

      // Refresh the dashboard stats
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  // Calculate utilization percentage
  const totalVehicles = summary?.totalVehicles || 0;
  const activeTrips = summary?.activeTrips || 0;
  const utilizationPercentage = totalVehicles > 0 ? Math.round((activeTrips / totalVehicles) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Header with Seed Button */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fleet Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Real-time overview of fleet operations</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-none">
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 hover:scale-[1.02] disabled:bg-blue-300 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isSeeding ? 'Seeding...' : 'Load Demo Data'}
            </button>
            {seedMessage && (
              <span className="text-sm text-green-600 font-medium transition-opacity">{seedMessage}</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Vehicles Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition p-6">
          <dt className="text-sm font-medium text-gray-500">Total Vehicles</dt>
          <dd className="mt-2 text-3xl font-bold text-gray-900">{summary?.totalVehicles || 0}</dd>
        </div>

        {/* Idle Vehicles Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition p-6">
          <dt className="text-sm font-medium text-gray-500">Idle Vehicles</dt>
          <dd className="mt-2 text-3xl font-bold text-green-600">{summary?.idleVehicles || 0}</dd>
        </div>

        {/* Active Trips Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition p-6">
          <dt className="text-sm font-medium text-gray-500">Active Trips</dt>
          <dd className="mt-2 text-3xl font-bold text-blue-600">{summary?.activeTrips || 0}</dd>
        </div>

        {/* Vehicles In Shop Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition p-6">
          <dt className="text-sm font-medium text-gray-500">Vehicles In Shop</dt>
          <dd className="mt-2 text-3xl font-bold text-red-600">{summary?.inShopVehicles || 0}</dd>
        </div>
      </div>

      {/* CSS Data Visualization: Utilization Rate */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fleet Utilization Rate</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{utilizationPercentage}%</p>
          </div>
          <span className="text-sm text-gray-400 font-medium">{activeTrips} Active / {totalVehicles} Total</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${utilizationPercentage}%` }}
          >
            {/* Optional gloss reflection for premium feel */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Trips</h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vehicle</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Origin</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Destination</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date Logged</th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {!summary?.recentTrips || summary.recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-gray-500">
                      No recent trips
                    </td>
                  </tr>
                ) : (
                  summary.recentTrips.map((trip) => (
                    <tr key={trip._id} className="odd:bg-gray-50 hover:bg-gray-100 transition">
                      <td className="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900">
                        {trip.vehicle?.plateNumber || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{trip.origin}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{trip.destination}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {trip.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                            {trip.status}
                          </span>
                        ) : trip.status === 'In Progress' || trip.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            {trip.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            {trip.status}
                          </span>
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
    </div>
  );
}
