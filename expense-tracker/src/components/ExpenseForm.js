// src/components/ExpenseForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const incomeData = {
        amount,
        source,
        description,
        date,
        recurrence,
    };

    try {
        const response = await axios.post('http://localhost:8000/api/incomes', incomeData);  // Correct URL here
        if (response.status === 201) {
            alert('Income added successfully!');
        }
    } catch (err) {
        setError('Failed to add income. Please try again.');
        console.error('Error details:', err.response ? err.response.data : err.message);
    }
};


  return (
    <div>
      <h2>Add Expense</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
