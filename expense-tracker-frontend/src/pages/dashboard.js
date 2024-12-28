import React, { useEffect, useState } from "react";
import apiClient from "../api/axios";
import { jsPDF } from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useTable, usePagination, useSortBy } from "react-table";
import "./css/dashboard.css";

const Dashboard = () => {
    const [data, setData] = useState({
        total_income: 0,
        total_expense: 0,
        balance: 0,
        incomes: [],
        expenses: [],
    });
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState("");

    const [filteredIncomes, setFilteredIncomes] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    const [expenseChartData, setExpenseChartData] = useState([]); // Declare chart data state

    const [error, setError] = useState('');
    // Filters
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isRange, setIsRange] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [data, selectedDate, startDate, endDate, isRange]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await apiClient.get("/all-expenses-and-income", { headers });

            const { total_income, total_expense, incomes, expenses } = response.data;
            setData(response.data);
            setFilteredIncomes(incomes);
            setFilteredExpenses(expenses);

            if (total_income - total_expense < 100) {
                setAlertMessage("Warning: Low balance. Consider limiting expenses!");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filteredIncome = data.incomes;
        let filteredExpense = data.expenses;
    
        if (isRange && startDate && endDate) {
            filteredIncome = filteredIncome.filter((i) => {
                const itemDate = new Date(i.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
    
            filteredExpense = filteredExpense.filter((e) => {
                const itemDate = new Date(e.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
        } else if (selectedDate) {
            filteredIncome = filteredIncome.filter(
                (i) => new Date(i.date).toDateString() === selectedDate.toDateString()
            );
            filteredExpense = filteredExpense.filter(
                (e) => new Date(e.date).toDateString() === selectedDate.toDateString()
            );
        }
    
        setFilteredIncomes(filteredIncome);
        setFilteredExpenses(filteredExpense);
    
        // Prepare expense chart data
        const expenseCategories = filteredExpense.reduce((acc, expense) => {
            if (expense.category) {
                acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount || 0);
            } else {
                acc["Uncategorized"] = (acc["Uncategorized"] || 0) + parseFloat(expense.amount || 0);
            }
            return acc;
        }, {});
        
    
        const newExpenseChartData = Object.keys(expenseCategories).map((category) => ({
            name: category,
            value: expenseCategories[category],
        }));
    
        console.log('Expense Chart Data:', newExpenseChartData); // Debug
        setExpenseChartData(newExpenseChartData);
    };
    

    const chartData = filteredIncomes.map((income, index) => ({
        date: income.date,
        income: income.amount,
        expense: filteredExpenses[index] ? filteredExpenses[index].amount : 0,
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const columns = React.useMemo(
        () => [
            { Header: "Date", accessor: "date" },
            { Header: "Source/Category", accessor: "source" },
            { Header: "Amount ($)", accessor: "amount" },
        ],
        []
    );

    const combinedData = React.useMemo(
        () => [
            ...filteredIncomes.map((income) => ({
                ...income,
                source: `Income - ${income.source}`,
            })),
            ...filteredExpenses.map((expense) => ({
                ...expense,
                source: `Expense - ${expense.category}`,
            })),
        ],
        [filteredIncomes, filteredExpenses]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data: combinedData,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useSortBy,
        usePagination
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Dashboard Report", 20, 20);
        doc.text(`Total Income: $${data.total_income}`, 20, 30);
        doc.text(`Total Expense: $${data.total_expense}`, 20, 40);
        doc.text(`Balance: $${data.balance}`, 20, 50);
        doc.save("dashboard_report.pdf");
    };

    return (
        <div className="dashboard">
            {alertMessage && <div className="alert">{alertMessage}</div>}

            <div className="metrics">
                <div className="card">Total Income: ${data.total_income}</div>
                <div className="card">Total Expense: ${data.total_expense}</div>
                <div className="card">Net Balance: ${data.balance}</div>
            </div>

            <div className="filters">
                <label>
                    <input
                        type="checkbox"
                        checked={isRange}
                        onChange={() => setIsRange(!isRange)}
                    />
                    Date Range
                </label>
                {isRange ? (
                    <>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Start Date"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            placeholderText="End Date"
                        />
                    </>
                ) : (
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        placeholderText="Select Date"
                        isClearable
                    />
                )}
            </div>

            <div className="charts">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="income" stroke="#8884d8" />
                        <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="50%" height={300}>
                    {expenseChartData && expenseChartData.length > 0 ? (
                        <PieChart>
                            <Pie
                                data={expenseChartData}
                                dataKey="value"
                                nameKey="name"
                                label
                                outerRadius={80}
                            >
                                {expenseChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    
                    ) : (
                        <div>No data available</div>
                    )}
                </ResponsiveContainer>

            </div>

            <div className="tables">
                <h4>Filtered Transactions</h4>
                <table {...getTableProps()} className="table">
                    <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => {
                                const columnProps = column.getHeaderProps(column.getSortByToggleProps());
                                return (
                                    <th key={columnProps.key} {...columnProps}>
                                        {column.render("Header")}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr key={row.id} {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        const cellProps = cell.getCellProps();
                                        return (
                                            <td key={cellProps.key} {...cellProps}>
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    <span>
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                </div>
            </div>

            <button onClick={generatePDF}>Export PDF</button>
        </div>
    );
};

export default Dashboard;
