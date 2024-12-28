import React, { useState } from 'react';
import axios from 'axios';

const AddIncome = () => {
    const [amount, setAmount] = useState('');
    const [source, setSource] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [recurrence, setRecurrence] = useState('once');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure all required fields have valid values
        if (!amount || !source || !date) {
            setError('Please fill in all required fields.');
            return;
        }

        const incomeData = {
            amount,
            source,
            description,
            date,
            recurrence,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/incomes/', incomeData, {
                headers: {
                    'Authorization': `Bearer your_token_here`,  // Add valid auth token
                },
            });
            if (response.status === 201) {
                alert('Income added successfully!');
                // Optionally, reset the form
                setAmount('');
                setSource('');
                setDescription('');
                setDate('');
                setRecurrence('once');
            }
        } catch (err) {
            setError('Failed to add income. Please try again.');
            console.error('Error details:', err.response ? err.response.data : err.message);
        }
    };

    return (
        <div>
            <h2>Add Income</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Source</label>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Recurrence</label>
                    <select
                        value={recurrence}
                        onChange={(e) => setRecurrence(e.target.value)}
                        required
                    >
                        <option value="once">Once</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit">Add Income</button>
            </form>
        </div>
    );
};

export default AddIncome;
