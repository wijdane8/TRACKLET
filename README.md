# Expense Tracker Application

A robust and feature-rich Expense Tracker application that allows users to manage personal expenses across web and mobile platforms. The app supports CRUD operations, advanced action logging, and optional filtering functionality. It leverages **PHP** for the backend, **React** for the web frontend.

---

## 🌟 Features

### Core Features
- **Expense List**: View a list of all expenses with details such as amount, category, date, and description. 
- **Add Expense**: Create new expenses using a simple form.
- **Edit Expense**: Modify details of existing expenses.
- **Delete Expense**: Remove expenses with a confirmation prompt.
- **Search Expenses**: Search for expenses by keywords in the description or category.

### Advanced Features
- **Action Logging**: Track every CRUD operation with details such as:
  - Expense ID
  - Action type
  - Description
  - IP address
  - Timestamp

---

## 🛠️ Tech Stack

### Backend
- **Language**: PHP
- **Framework**: Laravel
- **Database**: MySQL
- **API**: RESTful API implementation
- **Security**: Input validation, data encryption, and role-based access control

### Web Frontend
- **Framework**: React
- **Styling**:CSS
- **Design**: Responsive and modern layout

---

## 📥 Installation & Setup

### Backend Setup

1. **Clone the repository:**

   Open your terminal and execute the following commands:
   
Install dependencies:
Ensure you have Composer installed, then run:

composer install
Set up environment variables:
Create a .env file by copying the example file:

cp .env.example .env
Update the .env file with your database credentials.
Generate the application key:
php artisan key:generate
Run migrations:
php artisan migrate
Run the development server:
Start the Laravel backend server:

php artisan serve
The backend will now be accessible at http://127.0.0.1:8000.
Frontend Setup
Navigate to the frontend directory:
cd ../frontend
Install dependencies:
Ensure Node.js and npm are installed, then run:

npm install
Run the development server:
Start the React development server:

npm start
The frontend will now be accessible at http://localhost:3000.

---
### 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---
### 🧑‍💻 Authors

Wijdan AlHarbi - [GitHub Profile](https://github.com/wijdane8)

---
### 📧 Contact

If you have any questions, feel free to reach out:

Email: wijdane.ali@gmail.com
