import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/header.css';  // Import the CSS file

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const [user, setUser] = useState(null);  // State to store user data
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const headerRef = useRef(null);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Also clear user data on logout
        navigate('/Login');
    }, [navigate]);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Set the user data from localStorage
            }
        }
    }, [isLoggedIn]);

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                if (window.scrollY > 50) { // Add threshold for scroll
                    headerRef.current.classList.add('scrolled');
                } else {
                    headerRef.current.classList.remove('scrolled');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className="header" ref={headerRef}>
            <nav className="nav">
                <ul className="navList">
                    <li className="navItem">
                        <a href="/">Home</a>
                    </li>
                    <li className="navItem">
                        <a href="/about">About Us</a>
                    </li>
                    <li className="navItem">
                        <a href="/contact">Contact Us</a>
                    </li>
                    <li className="navItem">
                        <a href="/expenses-tracker">
                            Expenses Tracker
                        </a>
                    </li>
                    
                    {!isLoggedIn ? (
                        <>
                            <li className="navItem">
                                <a href="/Register">Register</a>
                            </li>
                            <li className="navItem">
                                <a href="/Login">Login</a>
                            </li>
                        </>
                    ) : null}
                </ul>
            </nav>

            {isLoggedIn && user && (
                <div className="profileDropdown" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="profileButton"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen ? 'true' : 'false'}
                    >
                        <i className="fas fa-user-circle icon"></i>
                    </button>

                    {isDropdownOpen && (
                        <div className="dropdownMenu">
                            <a href="/user" className="linkItem">
                            <p style={{ textTransform: 'capitalize' }}>
                                {user.name ? user.name + '\'s Profile' : 'Profile'}
                            </p>
                            </a>
                            <a href="/dashboard" className="linkItem">
                                Dashboard
                            </a>
                            <a href="/all-expenses" className="linkItem">
                                My Expenses
                            </a>
                            <a href="/logs" className="linkItem">
                                Logs
                            </a>
                            <a href="/incomes" className="linkItem">
                                Incomes
                            </a>
                            <button onClick={handleLogout} className="logoutButton">
                                <i className="fas fa-sign-out-alt icon"></i>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}

        </header>
    );
};

export default Header;
