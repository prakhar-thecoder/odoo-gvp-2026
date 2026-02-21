const API_URL = 'http://localhost:5000/api/vehicles';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const getVehicles = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
    }
    return response.json();
};

export const createVehicle = async (vehicleData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vehicleData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create vehicle');
    }
    return data;
};

export const deleteVehicle = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to delete vehicle');
    }
    return response.json();
};

export const updateVehicleStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update vehicle status');
    }
    return data;
};
