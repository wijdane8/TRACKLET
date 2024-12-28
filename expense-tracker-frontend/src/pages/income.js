import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import './css/income.css';
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell
} from 'recharts';
import { Tabs, Tab } from '@mui/material';
import '@fortawesome/fontawesome-free/css/all.min.css';

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C",
    "#3498DB", "#FFD700", "#FFA07A", "#BA55D3", "#9ACD32", "#4B0082",
    "#8B008B", "#008B8B", "#B22222", "#228B22"
];

const Income = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [incomes, setIncomes] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [monthlyChartData, setMonthlyChartData] = useState([]);
    const [formData, setFormData] = useState({
        source: '',
        amount: '',
        description: '',
        date: '',
        recurrence: 'once'
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [incomeToEdit, setIncomeToEdit] = useState(null);
    const [message, setMessage] = useState('');

    const fetchIncomes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication token not found');
                return;
            }
            const userId = 1; // Replace with the actual user ID you need
            const response = await apiClient.get(`/incomes/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const incomesData = response.data.data;

            // Aggregate for charts
            const aggregatedCategoryData = incomesData.reduce((acc, income) => {
                const category = income.source || 'Uncategorized';
                if (!acc[category]) acc[category] = 0;
                acc[category] += parseFloat(income.amount || 0);
                return acc;
            }, {});

            const categoryChartData = Object.keys(aggregatedCategoryData).map(category => ({
                category,
                amount: aggregatedCategoryData[category]
            }));

            const aggregatedMonthlyData = incomesData.reduce((acc, income) => {
                const month = new Date(income.date).toLocaleString('default', { month: 'long' });
                if (!acc[month]) acc[month] = 0;
                acc[month] += parseFloat(income.amount || 0);
                return acc;
            }, {});

            const monthlyChartData = Object.keys(aggregatedMonthlyData).map(month => ({
                month,
                amount: aggregatedMonthlyData[month]
            }));

            setIncomes(incomesData);
            setChartData(categoryChartData);
            setMonthlyChartData(monthlyChartData);
        } catch (error) {
            setMessage('Failed to load incomes');
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication token not found');
                return;
            }
            if (editMode) {
                await apiClient.put(`/incomes/${incomeToEdit.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage('Income updated successfully');
            } else {
                await apiClient.post('/incomes', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage('Income added successfully');
            }
            setFormData({ source: '', amount: '', description: '', date: '', recurrence: 'once' });
            setModalVisible(false);
            fetchIncomes();
        } catch (error) {
            setMessage('Failed to add/update income');
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication token not found');
                return;
            }
            await apiClient.delete(`/incomes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Income deleted successfully');
            fetchIncomes();
        } catch (error) {
            setMessage('Failed to delete income');
        }
    };

    const handleEdit = (income) => {
        setFormData({
            source: income.source,
            amount: income.amount,
            description: income.description,
            date: income.date,
            recurrence: income.recurrence
        });
        setEditMode(true);
        setIncomeToEdit(income);
        setModalVisible(true);
    };

    const openModal = () => {
        setModalVisible(true);
        setEditMode(false);
        setFormData({ source: '', amount: '', description: '', date: '', recurrence: 'once' });
    };

    const closeModal = () => setModalVisible(false);

    const calculateTotal = () =>
        incomes.reduce((total, income) => total + parseFloat(income.amount || 0), 0).toFixed(2);

    return (
        <div className="income-container">
            <h2>Income</h2>
            {message && <p className="message">{message}</p>}
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Income List" />
                <Tab label="Charts" />
            </Tabs>
            <div>
                {activeTab === 1 && (
                    <div className="charts-wrapper">
                        <div className="chart-container">
                            <h3>Income by Source</h3>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={chartData}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                        <div className="chart-container">
                            <h3>Monthly Income</h3>
                            <BarChart width={400} height={400} data={monthlyChartData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount">
                                    {monthlyChartData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </div>
                    </div>
                )}
                {activeTab === 0 && (
                    <div>
                        <button onClick={openModal}>Add Income</button>
                        <h3>Your Incomes</h3>
                        {incomes.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomes.map((income) => (
                                        <tr key={income.id}>
                                            <td>{income.source}</td>
                                            <td>{income.amount}</td>
                                            <td>{income.description}</td>
                                            <td>{new Date(income.date).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => handleEdit(income)}>Edit</button>
                                                <button onClick={() => handleDelete(income.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No income records found.</p>
                        )}
                        <div>Total: {calculateTotal()}</div>
                    </div>
                )}
            </div>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span onClick={closeModal}>&times;</span>
                        <h3>{editMode ? 'Edit Income' : 'Add New Income'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Source</label>
                                <input
                                    type="text"
                                    name="source"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Recurrence</label>
                                <select
                                    name="recurrence"
                                    value={formData.recurrence}
                                    onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                                >
                                    <option value="once">Once</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <button type="submit">{editMode ? 'Update' : 'Add'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Income;
