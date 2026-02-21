const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/dashboard`;
const SEED_API_URL = `${BASE_URL}/seed`;
console.log(API_URL);

export const fetchDashboardSummary = async () => {
    const response = await fetch(`${API_URL}/summary`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard summary');
    }
    return response.json();
};

export const seedDemoData = async () => {
    const response = await fetch(`${SEED_API_URL}/demo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to seed demo data');
    }
    return data;
};
