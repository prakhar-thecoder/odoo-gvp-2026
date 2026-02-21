import React, { useState, useEffect } from 'react';
import { getVehicles, createVehicle, deleteVehicle, updateVehicleStatus } from './vehiclesApi';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [plateNumber, setPlateNumber] = useState('');
    const [model, setModel] = useState('');
    const [type, setType] = useState('');
    const [maxLoadKg, setMaxLoadKg] = useState('');
    const [currentOdometer, setCurrentOdometer] = useState('');

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await getVehicles();
            setVehicles(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await createVehicle({
                plateNumber,
                model,
                type,
                maxLoadKg: Number(maxLoadKg),
                currentOdometer: Number(currentOdometer) || 0
            });
            // Reset form
            setPlateNumber('');
            setModel('');
            setType('');
            setMaxLoadKg('');
            setCurrentOdometer('');
            // Refresh list
            fetchVehicles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await deleteVehicle(id);
            fetchVehicles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateVehicleStatus(id, newStatus);
            fetchVehicles();
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Idle': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'On Trip': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'In Shop': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Vehicle Registry</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add New Vehicle</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plate Number *</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={plateNumber}
                                onChange={(e) => setPlateNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model *</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="e.g. Truck, Van"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Load (kg) *</label>
                            <input
                                type="number"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={maxLoadKg}
                                onChange={(e) => setMaxLoadKg(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Odometer</label>
                            <input
                                type="number"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={currentOdometer}
                                onChange={(e) => setCurrentOdometer(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Vehicle
                        </button>
                    </form>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Vehicle List</h2>
                    {loading ? (
                        <p className="text-gray-500 dark:text-gray-400">Loading vehicles...</p>
                    ) : vehicles.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No vehicles found. Add one to get started.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model/Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Capacity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Odom.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {vehicles.map((v) => (
                                    <tr key={v._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{v.plateNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {v.model} <br/>
                                            <span className="text-xs text-gray-400">{v.type || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.maxLoadKg} kg</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{v.currentOdometer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select
                                                value={v.status}
                                                onChange={(e) => handleStatusChange(v._id, e.target.value)}
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(v.status)} border-0 focus:ring-0 cursor-pointer`}
                                            >
                                                <option value="Idle">Idle</option>
                                                <option value="On Trip">On Trip</option>
                                                <option value="In Shop">In Shop</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(v._id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Vehicles;
