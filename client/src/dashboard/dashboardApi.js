const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/dashboard';

export const fetchDashboardSummary = async () => {
    const response = await fetch(`${API_URL}/summary`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard summary');
    }
    return response.json();
};
