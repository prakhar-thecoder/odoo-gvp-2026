const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/maintenance`;
const VEHICLES_API_URL = `${BASE_URL}/vehicles`;

export const fetchVehicles = async () => {
    const response = await fetch(VEHICLES_API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
    }
    return response.json();
};

export const fetchMaintenanceLogs = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch maintenance logs');
    }
    return response.json();
};

export const createMaintenanceLog = async (data) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to create maintenance log');
    }
    return response.json();
};

export const updateMaintenanceStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update maintenance status');
    }
    return response.json();
};
