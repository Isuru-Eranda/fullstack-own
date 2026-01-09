// API configuration
const rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5008/api').toString().trim();
export const API_BASE_URL = rawBase.replace(/\/+$/, ''); // remove trailing slashes

// Safely build endpoint URLs: joins base and endpoint without producing double slashes
export function buildUrl(endpoint) {
	const e = endpoint.toString().replace(/^\/+/, '');
	return `${API_BASE_URL}/${e}`;
}

export default API_BASE_URL;