const API_URL = 'http://localhost:5000/api/trips';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const getTrips = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch trips');
    }
    return response.json();
};

export const createTrip = async (tripData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(tripData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create trip');
    }
    return data;
};

export const updateTripStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update trip status');
    }
    return data;
};
