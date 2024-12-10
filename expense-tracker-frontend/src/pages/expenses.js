import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; 
import './css/expenses.css';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, LabelList } from 'recharts';
import { Tabs, Tab } from '@mui/material';
import '@fortawesome/fontawesome-free/css/all.min.css';


const COLORS =[
            "#0088FE", // Deep Sky Blue
    "#00C49F", // Medium Turquoise
    "#FFBB28", // Goldenrod
    "#FF8042", // Dark Orange
    "#A569BD", // Purple
    "#E74C3C", // Coral
    "#3498DB", // Steel Blue
    "#FFD700", // Gold
    "#FFA07A", // Light Salmon
    "#BA55D3", // Medium Orchid
    "#9ACD32", // Yellow Green
    "#4B0082", // Indigo
    "#8B008B", // Dark Magenta
    "#008B8B", // Dark Cyan
    "#B22222", // Firebrick
    "#228B22"  // Forest Green
];
const Expenses = () => {
    const [activeTab, setActiveTab] = useState(0); // Tab state
    const [selectedCategory, setSelectedCategory] = useState('');
    const [monthlyChartData, setMonthlyChartData] = useState([]);
    const [highestMonth, setHighestMonth] = useState({ month: '', amount: 0 }); // Track highest month
    const [expenses, setExpenses] = useState([]); 
    const [chartData, setChartData] = useState([]);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        date: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust as needed
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    const currentExpenses = expenses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ).filter(expense => !selectedCategory || expense.category === selectedCategory);
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false); 
    const [expenseToEdit, setExpenseToEdit] = useState(null); 
    const [modalVisible, setModalVisible] = useState(false); 

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        fetchExpenses(e.target.value);
      };
      const fetchExpenses = async (categoryFilter = '') => {
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
    
                // Aggregate data by category for the pie chart
                const aggregatedCategoryData = expensesData.reduce((acc, expense) => {
                    const category = expense.category || 'Uncategorized';
                    if (!acc[category]) acc[category] = 0;
                    acc[category] += parseFloat(expense.amount || 0);
                    return acc;
                }, {});
    
                const categoryChartData = Object.keys(aggregatedCategoryData).map((category) => ({
                    category,
                    amount: aggregatedCategoryData[category],
                }));
    
                // Aggregate data by month for the bar chart
                const aggregatedMonthlyData = expensesData.reduce((acc, expense) => {
                    const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
                    if (!acc[month]) acc[month] = 0;
                    acc[month] += parseFloat(expense.amount || 0);
                    return acc;
                }, {});
    
                const monthlyChartData = Object.keys(aggregatedMonthlyData).map((month) => ({
                    month,
                    amount: aggregatedMonthlyData[month],
                }));
    
                // Find the highest spending month
                const highest = monthlyChartData.reduce((prev, current) =>
                    current.amount > prev.amount ? current : prev,
                    { month: '', amount: 0 }
                );
    
                setExpenses(expensesData);
                setChartData(categoryChartData); 
                setMonthlyChartData(monthlyChartData);
                setHighestMonth(highest); // Set highest spending month
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
    ];
    const renderCustomLabel = (props) => {
        const { x, y, value } = props;
        return (
            <text x={x} y={y - 10} fill="#000" textAnchor="middle" fontSize={12}>
                {value} SR
            </text>
        );
    };
    const start_index = (currentPage - 1) * itemsPerPage;
    const end_index = Math.min(currentPage * itemsPerPage, expenses.length - 1);
    const total_expenses = expenses.length;
    return (
        <div className="expenses-container">
            <h2>Expenses</h2>

            {message && <p className="message">{message}</p>}
            <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Expenses" />
                <Tab label="Charts" />
            </Tabs>
            <div className="expenses-list">
                <div class="add-container">
                <button onClick={openModal} className="btn-open-modal">Add Expense</button>
                </div>
                {activeTab === 1 && (
                <div className="charts-wrapper">
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
    <div className="chart-container">
        <h3>Monthly Expenses</h3>
        <BarChart width={400} height={400} data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} >
            <XAxis dataKey="month" padding={{ left: 20, right: 20 }} />
            <YAxis padding={{ top: 10, bottom: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount">
        {monthlyChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
        <LabelList dataKey="amount" content={renderCustomLabel} />
    </Bar>
        {highestMonth.month && (
            <p className="highlight">
                The month with the highest expenses is <strong>{highestMonth.month}</strong> with a total of 
                <strong> ${highestMonth.amount.toFixed(2)}</strong>.
            </p>
        )}
        </BarChart>
    </div>
</div>
                )}
                {activeTab === 0 && (
                    <div>
                <h3>Your Expenses</h3>
                <div className="filter-container">
                    <label htmlFor="category-filter">Filter by Category:</label>
                    <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">All Categories</option>
                        {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                        ))}
                    </select>
</div>
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
                            {currentExpenses.map((expense) => (
                                <tr key={expense.id}>
                                <td>{expense.description}</td>
                                <td>{expense.amount}</td>
                                <td>{expense.category}</td>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>
                                <button onClick={() => handleEdit(expense)} className="btn-edit">
                                <i className="fas fa-edit"></i> {/* Edit icon */}
                                </button>
                                <button onClick={() => handleDelete(expense.id)} className="btn-delete">
                                <i className="fas fa-trash-alt"></i> {/* Delete icon */}
                                </button>
                                </td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="total">
                            <h4>Total: ${calculateTotal()}</h4>
                        </div>
                        <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={pageNumber === currentPage ? 'active-page' : ''}
                        >
                        {pageNumber}
                        </button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </div>
                    <span className="page-range">Showing {start_index + 1}-{end_index} of {total_expenses} expenses</span>
        </>
      ) : (
        <p>No expenses recorded yet.</p>

      )}
      </div>
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