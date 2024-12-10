import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Router and Route components
import Header from './components/Header';  
import Footer from './components/Footer'; 
import Login from './pages/Login';  
import Register from './pages/Register';  
import VerifyOtp from './pages/VerifyOtp';
import Expenses from './pages/expenses';
import Home from './pages/Home';  
import Logs from './pages/logs';

const App = () => {
  return (
    <Router>  
      <Header />  
      
      <main>
        <Routes>  
          <Route path="/"element={<Home />} /> 
          <Route path="/login" element={<Login />} />  
          <Route path="/register" element={<Register />} /> 
          <Route path="/verify" element={<VerifyOtp />} />
          <Route path="/all-expenses" element={<Expenses />} />
          <Route path="//logs" element={<Logs />} />
        </Routes>
      </main>
      
      <Footer /> 
    </Router>
  );
}

export default App;
