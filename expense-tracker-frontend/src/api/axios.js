import axios from 'axios';

// Create an axios instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://saffapi-838cfb0a8bf7c6fe352e6d0a1f35c0a8a16ae898.test/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add a request interceptor to dynamically add the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        // Return the response if the request is successful
        return response;
    },
    (error) => {
        // Handle errors
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('API Error:', error.response.data);
            if (error.response.status === 401) {
                console.warn('Unauthorized access - maybe token is invalid or expired');
                // Optional: Log the user out if token is invalid/expired
                localStorage.removeItem('token');
                window.location.href = '/login'; // Redirect to login page
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
        } else {
            // Something happened while setting up the request
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
