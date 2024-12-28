import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://saffapi-838cfb0a8bf7c6fe352e6d0a1f35c0a8a16ae898.test/api', 
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
