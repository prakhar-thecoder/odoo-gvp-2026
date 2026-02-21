const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchVehicles = async () => {
    const response = await fetch(`${API_URL}/vehicles`);
    if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
    }
    return response.json();
};

export const fetchMaintenanceLogs = async () => {
    const response = await fetch(`${API_URL}/maintenance`);
    if (!response.ok) {
        throw new Error('Failed to fetch maintenance logs');
    }
    return response.json();
};

export const createMaintenanceLog = async (data) => {
    const response = await fetch(`${API_URL}/maintenance`, {
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
    const response = await fetch(`${API_URL}/maintenance/${id}/status`, {
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
