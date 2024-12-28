import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic here
        onLogout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f4f4f4' }}>
            <div>
                <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
                <Link to="/add-expense" style={{ marginRight: '15px' }}>Add Expense</Link>
                <Link to="/add-income" style={{ marginRight: '15px' }}>Add Income</Link>
                <Link to="/reports">Reports</Link>
            </div>
            <div>
                {isLoggedIn ? (
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
