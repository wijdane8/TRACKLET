import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
  };

  return  (
        <Router>
            <Header />
            <Routes>
                {/* Dashboard route */}
                <Route path="/" element={<div>Dashboard</div>} />
                
                {/* Add Expense route */}
                <Route path="/add-expense" element={<ExpenseForm />} />
                
                {/* Add Income route */}
                <Route path="/add-income" element={<IncomeForm />} />
                
                {/* Reports route */}
                <Route path="/reports" element={<div>Reports</div>} /> 
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
