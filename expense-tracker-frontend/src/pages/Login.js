import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import './css/login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('/login', formData);
            const { message, token, user } = response.data;

            setMessage(message);

            if (message.toLowerCase().includes('successful')) {
                // Save token to local storage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect based on email verification status
                if (!user.email_verified_at) {
                    navigate('/verify', { state: { email: user.email } });
                } else {
                    navigate('/all-expenses');
                }
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message || 'Invalid credentials');
            } else if (error.request) {
                setMessage('Server is not responding. Please try again later.');
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {message && <p className="message">{message}</p>}
                </form>

                <div className="register-prompt">
                    <p>
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register')} className="register-link">
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
