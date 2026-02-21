import React, { useState, useEffect } from 'react';
import { fetchDashboardSummary } from './dashboardApi';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    loadData();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fleet Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Overview of current vehicles, active trips, and ongoing maintenance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Vehicles Card */}
        <div className="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Total Vehicles</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{summary?.totalVehicles || 0}</dd>
          </div>
        </div>

        {/* Idle Vehicles Card */}
        <div className="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Idle Vehicles</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-blue-600">{summary?.idleVehicles || 0}</dd>
          </div>
        </div>

        {/* Active Trips Card */}
        <div className="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Active Trips</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-green-600">{summary?.activeTrips || 0}</dd>
          </div>
        </div>

        {/* Vehicles In Shop Card */}
        <div className="bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">Vehicles In Shop</dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight text-red-600">{summary?.inShopVehicles || 0}</dd>
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4">Recent Trips</h2>
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Vehicle</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Origin</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Destination</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Logged</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {!summary?.recentTrips || summary.recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-sm text-gray-500">
                      No recent trips found.
                    </td>
                  </tr>
                ) : (
                  summary.recentTrips.map((trip) => (
                    <tr key={trip._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {trip.vehicle?.plateNumber || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{trip.origin}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{trip.destination}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${trip.status === 'Completed'
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : trip.status === 'In Progress' || trip.status === 'Active'
                              ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                              : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                          }`}>
                          {trip.status}
                        </span>
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
