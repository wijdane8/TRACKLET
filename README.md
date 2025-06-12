# 📊 Tracklet - Smart Expense Tracker

**Tracklet** is a powerful, modern, and responsive Expense Tracker application that helps users manage personal finances across web platforms. Built using **Laravel** for the backend and **React** for the frontend, Tracklet provides an intuitive interface, secure APIs, and insightful expense management features.

---

## 🌟 Features

### ✅ Core Features

* **Dashboard**: Visual overview of total expenses, categories, and trends.
* **Expense List**: View a list of all expenses with details such as amount, category, date, and description.
* **Add Expense**: Create new expenses using a simple and clean form.
* **Edit Expense**: Modify the details of existing expenses.
* **Delete Expense**: Remove expenses with a confirmation step.
* **Search & Filter**: Easily search and filter expenses by description, category, or date.

### 🧠 Advanced Features

* **Action Logging**: Track every CRUD operation with key metadata:

  * Expense ID
  * Action Type
  * Description
  * IP Address
  * Timestamp

---

## 🛠️ Tech Stack

### 🖙 Backend

* **Language**: PHP
* **Framework**: Laravel
* **Database**: MySQL
* **API**: RESTful API architecture
* **Security**: Input validation, data encryption, and role-based access control

### 🌐 Frontend

* **Framework**: React
* **Styling**: CSS
* **Design**: Responsive and modern UI/UX

---

## ⚙️ Installation & Setup

### 📦 Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/tracklet.git
cd tracklet/backend

# Install backend dependencies
composer install

# Copy environment file and update credentials
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start the Laravel development server
php artisan serve
```

The backend server will be running at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 💻 Frontend Setup

Open a **new terminal** window and follow these steps:

```bash
# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Start the React development server
npm start
```

The frontend will be available at: [http://localhost:3000](http://localhost:3000)

> Make sure the Laravel backend is running before starting the frontend.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👩‍💻 Author

**Wijdan AlHarbi**
GitHub: [@wijdane8](https://github.com/wijdane8)
Email: [wijdane.ali@gmail.com](mailto:wijdane.ali@gmail.com)
