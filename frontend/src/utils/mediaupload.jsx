import { API_BASE_URL } from './api';

export default function MediaUpload(file) {
    return new Promise(async (resolve, reject) => {
        if (!file) {
            reject("Please select a file first");
            return;
        }

        try {
            // Create FormData to send the file
            const formData = new FormData();
            formData.append('file', file);

            // Get auth token
            const token = localStorage.getItem('token');
            
            // Upload to backend B2 endpoint
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                reject("Error uploading file: " + (errorData.message || response.statusText));
                return;
            }

            const data = await response.json();
            if (data.success && data.url) {
                resolve(data.url);
            } else {
                reject("Upload failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            reject("Error uploading file: " + error.message);
        }
    });
}