import React, { useEffect, useState } from 'react';
import apiClient from '../api/axios'; // Axios instance for API calls
import './css/logs.css'; // Optional: Add your own CSS styles

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Unauthorized: Please log in to view logs.');
                    setLoading(false);
                    return;
                }

                const response = await apiClient.get('/logs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLogs(response.data || []); // Setting logs data from the response
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Failed to fetch logs. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) {
        return <p>Loading logs...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="logs-container">
            <h1>Logs</h1>
            {logs.length === 0 ? (
                <p>No logs available.</p>
            ) : (
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Description</th>
                            <th>Expense</th>
                            <th>IP Address</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.id}</td>
                                <td>{log.user?.name || 'Unknown User'}</td>
                                <td>{log.action_type}</td>
                                <td>{log.description}</td>
                                <td>{log.expense?.description || 'N/A'}</td>
                                <td>{log.ip_address || 'N/A'}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Logs;
