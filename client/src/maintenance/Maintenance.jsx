import React, { useState, useEffect } from 'react';
import {
  fetchVehicles,
  fetchMaintenanceLogs,
  createMaintenanceLog,
  updateMaintenanceStatus
} from './maintenanceApi';

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    vehicleId: '',
    serviceType: '',
    description: '',
    cost: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedLogs, fetchedVehicles] = await Promise.all([
        fetchMaintenanceLogs(),
        fetchVehicles()
      ]);
      setLogs(fetchedLogs);

      // Only show vehicles that are Idle or On Trip (not already In Shop)
      // Actually, standard behavior allows any vehicle to go to shop if selected, 
      // but let's filter out 'In Shop' so we don't send them twice
      const availableVehicles = fetchedVehicles.filter(v => v.status !== 'In Shop');
      setVehicles(availableVehicles);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!formData.vehicleId || !formData.serviceType || !formData.cost) return;

      await createMaintenanceLog({
        vehicleId: formData.vehicleId,
        serviceType: formData.serviceType,
        description: formData.description,
        cost: Number(formData.cost)
      });

      // Reset form
      setFormData({ vehicleId: '', serviceType: '', description: '', cost: '' });
      // Refresh Data
      loadData();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await updateMaintenanceStatus(id, 'Completed');
      // Update local state without full reload for faster UI
      setLogs(prevLogs => prevLogs.map(log =>
        log._id === id ? { ...log, status: 'Completed' } : log
      ));

      // Reload vehicles in the background to update their statues
      const fetchedVehicles = await fetchVehicles();
      const availableVehicles = fetchedVehicles.filter(v => v.status !== 'In Shop');
      setVehicles(availableVehicles);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  if (loading && logs.length === 0) return <div className="p-8 text-center text-gray-500">Loading maintenance data...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Maintenance & Service Logs</h1>
        <p className="mt-2 text-sm text-gray-600">Track vehicle repairs and update their fleet status dynamically.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Main Grid: Form (Left) & Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ADD LOG FORM */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-5">Log New Service</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Vehicle</label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  required
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="" disabled>Select a vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.plateNumber} ({v.model})</option>
                  ))}
                </select>
                {vehicles.length === 0 && <p className="mt-1 text-xs text-orange-500">No idle vehicles available for service.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Service Type</label>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Oil Change, Tire Replacement"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>

              <button
                type="submit"
                disabled={!formData.vehicleId}
                className="mt-6 flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Create Record
              </button>
            </form>
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Vehicle Plate</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Service Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-sm text-gray-500">
                        No maintenance logs found.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {log.vehicle?.plateNumber || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {log.serviceType}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${log.cost?.toFixed(2) || '0.00'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${log.status === 'Completed'
                              ? 'bg-green-50 text-green-700 ring-green-600/20'
                              : 'bg-red-50 text-red-700 ring-red-600/10'
                            }`}>
                            {log.status || 'In Service'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {log.status !== 'Completed' && (
                            <button
                              onClick={() => handleMarkCompleted(log._id)}
                              className="text-blue-600 hover:text-blue-900 font-semibold"
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

      </div>
    </div>
  );
}
