import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import apiClient from '../api/axios';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        if (!token) {
            setMessage('Token not found. Please log in again.');
            return;
        }

        try {
             await apiClient.post(
                '/verify',
                { otp },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add Authorization header
                    },
                }
            );

            setMessage('Verification successful!');
            setTimeout(() => {
                navigate('/all-expenses'); // Redirect after a short delay
            }, 1000); // Delay to show success message
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid OTP.';
            setMessage(`${errorMessage}. Try again.`); // Append "Try again" to error message
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Verify OTP</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        marginBottom: '10px',
                        width: '200px',
                    }}
                />
                <br />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#608455',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Verify
                </button>
            </form>
            {message && (
                <p
                    style={{
                        marginTop: '10px',
                        color: message.includes('successful') ? 'green' : 'red',
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default VerifyOtp;
