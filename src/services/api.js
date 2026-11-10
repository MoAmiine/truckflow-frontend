const API_BASE_URL = 'http://localhost:5001/api/v1';


export async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
    }
    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(data?.message || 'Erreur réseau');
        error.statusCode = response.status;
        error.data = data;
        throw error;
    }
    return data;
}
