import React, { useState, useEffect } from 'react';
import { getVehicles, createVehicle, deleteVehicle, updateVehicleStatus } from './vehiclesApi';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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
        setSuccessMessage('');
        setIsSubmitting(true);
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
            setSuccessMessage('Vehicle added successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
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
            case 'Idle':
                return {
                    pill: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
                    dot: 'bg-green-500'
                };
            case 'On Trip':
                return {
                    pill: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
                    dot: 'bg-blue-500'
                };
            case 'In Shop':
                return {
                    pill: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
                    dot: 'bg-red-500'
                };
            default:
                return {
                    pill: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/20',
                    dot: 'bg-gray-500'
                };
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-sans text-gray-900 tracking-tight">Vehicle Registry</h1>
                <p className="mt-2 text-sm text-gray-500">Manage your fleet inventory, capacity, and current statuses.</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="text-green-600 font-medium mb-6">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 h-fit hover:shadow-xl transition">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Add New Vehicle</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Plate Number *</label>
                            <input
                                type="text"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={plateNumber}
                                onChange={(e) => setPlateNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Model *</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="e.g. Truck, Van"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max Load (kg) *</label>
                            <input
                                type="number"
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={maxLoadKg}
                                onChange={(e) => setMaxLoadKg(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Odometer</label>
                            <input
                                type="number"
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={currentOdometer}
                                onChange={(e) => setCurrentOdometer(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {isSubmitting ? 'Loading...' : 'Add Vehicle'}
                        </button>
                    </form>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-x-auto hover:shadow-xl transition">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">Fleet Vehicles</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading vehicles...</p>
                    ) : vehicles.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No vehicles added yet</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 rounded-lg">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model/Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odom.</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehicles.map((v) => (
                                    <tr key={v._id} className="odd:bg-gray-50 hover:bg-gray-100 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.plateNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {v.model} <br />
                                            <span className="text-xs text-gray-400">{v.type || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.maxLoadKg} kg</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.currentOdometer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(v.status).pill}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(v.status).dot}`}></span>
                                                <select
                                                    value={v.status}
                                                    onChange={(e) => handleStatusChange(v._id, e.target.value)}
                                                    className="bg-transparent border-none p-0 m-0 outline-none focus:ring-0 cursor-pointer appearance-none text-inherit font-medium"
                                                >
                                                    <option value="Idle" className="text-gray-900 bg-white">Idle</option>
                                                    <option value="On Trip" className="text-gray-900 bg-white">On Trip</option>
                                                    <option value="In Shop" className="text-gray-900 bg-white">In Shop</option>
                                                </select>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(v._id)}
                                                className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md font-medium transition-colors"
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
