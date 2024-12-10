import React, { useEffect, useState } from 'react';
import apiClient from '../api/axios'; // Axios instance for API calls
import './css/logs.css'; // Optional: Add your own CSS styles

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination state and function
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const calculateStartIndex = (currentPage, pageSize) => {
    return (currentPage - 1) * pageSize;
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(logs.length / pageSize);

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
          params: {
            // Add pagination parameters here if supported by your API
            // For example:
            // page: currentPage,
            // limit: pageSize
          },
        });

        setLogs(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch logs. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, pageSize]); // Re-run useEffect when currentPage changes

  const startIndex = calculateStartIndex(currentPage, pageSize);

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
            {logs.slice(startIndex, startIndex + pageSize).map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user?.name || 'Unknown User'}</td>
                <td>{log.action_type}</td>
                <td>{log.description}</td>
                <td>{log.expense?.description || '--'}</td>
                <td>{log.ip_address || 'N/A'}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination buttons (Optional) */}
      {logs.length > pageSize && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Logs;