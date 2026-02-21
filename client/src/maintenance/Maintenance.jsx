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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    setError(null);
    setSuccessMessage('');

    try {
      if (!formData.vehicleId || !formData.serviceType || !formData.cost) return;

      setIsSubmitting(true);
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
      setSuccessMessage('Maintenance record created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-sans text-gray-900 tracking-tight">Maintenance & Service Logs</h1>
        <p className="mt-2 text-sm text-gray-500">Track vehicle repairs and update their fleet status dynamically.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Main Grid: Form (Left) & Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ADD LOG FORM */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Log New Service</h3>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vehicle</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select a vehicle</option>
                {vehicles.map(v => (
                  <option key={v._id} value={v._id}>{v.plateNumber} ({v.model})</option>
                ))}
              </select>
              {vehicles.length === 0 && <p className="mt-1 text-xs text-orange-500">No idle vehicles available for service.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Service Type</label>
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                required
                placeholder="e.g. Oil Change, Tire Replacement"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Cost ($)</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={!formData.vehicleId || isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Saving...' : 'Create Record'}
            </button>
          </form>
        </div>

        {/* LOGS TABLE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-x-auto hover:shadow-xl transition">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Service Register</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 rounded-lg">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Plate</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-gray-500">
                    No maintenance logs yet
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="odd:bg-gray-50 hover:bg-gray-100 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.vehicle?.plateNumber || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${log.cost?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          {log.status || 'In Service'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {log.status !== 'Completed' && (
                        <button
                          onClick={() => handleMarkCompleted(log._id)}
                          className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors"
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
}
