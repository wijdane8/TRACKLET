import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        navigate('/Login'); // Redirect to Login page
    };

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    {!isLoggedIn ? (
                        <>
                            <li>
                                <a href="/Register">Register</a>
                            </li>
                            <li>
                                <a href="/Login">Login</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <a href="/all-expenses">My Expenses</a>
                            </li>
                            <li>
                                <a href="/logs">Logs</a>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#608455',
                                        cursor: 'pointer',
                                        fontSize: 'inherit',
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.color = '#175816')}
                                    onMouseLeave={(e) => (e.target.style.color = '#608455')}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
