import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; 
import './css/expenses.css';  
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A569BD',
    '#E74C3C',
    '#3498DB',
];

const Expenses = () => {
    const [expenses, setExpenses] = useState([]); 
    const [chartData, setChartData] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: '',
    });
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false); 
    const [expenseToEdit, setExpenseToEdit] = useState(null); 
    const [modalVisible, setModalVisible] = useState(false); 

    
    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication token not found');
                return;
            }
    
            const response = await apiClient.get('/all-expenses', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.data && response.data.data) {
                const expensesData = response.data.data;
    
                // Aggregate data by category for the chart
                const aggregatedData = expensesData.reduce((acc, expense) => {
                    const category = expense.category || 'Uncategorized';
                    if (!acc[category]) {
                        acc[category] = 0;
                    }
                    acc[category] += parseFloat(expense.amount || 0);
                    return acc;
                }, {});
    
                // Convert aggregated data to chart-friendly format
                const chartData = Object.keys(aggregatedData).map((category) => ({
                    category,
                    amount: aggregatedData[category],
                }));
    
                setExpenses(expensesData);
                setChartData(chartData); // Store chart data in state
            } else {
                setMessage('No expenses retrieved');
            }
        } catch (error) {
            console.error('Error fetching expenses:', error.response || error);
            setMessage('Failed to load expenses');
        }
    };
    
    
    
    useEffect(() => {
        fetchExpenses();
    }, []);

    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // In handleSubmit (Add/Edit expense)
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
            setMessage('Authentication token not found');
            return;
        }

        if (editMode) {
            await apiClient.put(`/expenses/${expenseToEdit.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Expense updated successfully');
            setEditMode(false);
            setExpenseToEdit(null);
        } else {
            await apiClient.post('/expenses', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Expense added successfully');
        }

        setFormData({ description: '', amount: '', category: '', date: '' });
        setModalVisible(false);
        fetchExpenses(); // Fetch expenses again after adding/updating
    } catch (error) {
        setMessage(error.response?.data?.message || 'Failed to add/update expense');
    }
};

// In handleDelete (Delete expense)
const handleDelete = async (id) => {
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
            setMessage('Authentication token not found');
            return;
        }

        await apiClient.delete(`/expenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Expense deleted successfully');
        fetchExpenses(); // Refresh the expenses list
    } catch (error) {
        setMessage('Failed to delete expense');
    }
};
    
    const handleEdit = (expense) => {
        setFormData({
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
        });
        setEditMode(true);
        setExpenseToEdit(expense); 
        setModalVisible(true); 
    };

    
    const calculateTotal = () => {
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0).toFixed(2);
    };

    
    const openModal = () => {
        setModalVisible(true);
        setEditMode(false);
        setFormData({ description: '', amount: '', category: '', date: '' }); // Clear form
    };

    
    const closeModal = () => {
        setModalVisible(false);
    };
    const categories = [
        'Food & Dining',
        'Transportation',
        'Housing & Utilities',
        'Health & Insurance',
        'Entertainment & Leisure',
        'Personal Care',
        'Shopping',
        'Education',
        'Family & Children',
        'Debt Repayment',
        'Savings & Investments',
        'Business/Work-Related',
        'Travel',
        'Miscellaneous',
        'Pets',
        'Custom (Add your own)',
    ];


    return (
        <div className="expenses-container">
            <h2>Expenses</h2>

            {message && <p className="message">{message}</p>}

            <div className="expenses-list">
                <div class="add-container">
                <button onClick={openModal} className="btn-open-modal">Add Expense</button>
                </div>
                {chartData.length > 0 && (
                            <div className="chart-container">
                                <h3>Expenses by Category</h3>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        )}
                <h3>Your Expenses</h3>

                {expenses.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount (Saudi Riyal)</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.description}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.category}</td>
                                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleEdit(expense)} className="btn-edit">Edit</button>
                                            <button onClick={() => handleDelete(expense.id)} className="btn-delete">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="total">
                            <h4>Total: ${calculateTotal()}</h4>
                        </div>
                    </>
                ) : (
                    <p>No expenses recorded yet.</p>
                )}

                
            </div>

            {modalVisible && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h3>{editMode ? 'Edit Expense' : 'Add New Expense'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Expense description"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Amount in Saudi Riyal"
                                required
                            />
                        </div>
                        <div className="input-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        <div className="input-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn">{editMode ? 'Update Expense' : 'Add Expense'}</button>
                            <button type="button" className="btn btn-cancel" onClick={closeModal}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            
            )}
        </div>
    );
};

export default Expenses;