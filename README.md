# bank-lending-project
# 🏦 Bank Lending System — Agetware Assignment

*Live Demo:* https://bank-lending-system-durga.netlify.app/

## 🔍 Overview

A full-stack *Bank Lending System* that allows:

- Creating new loans for customers
- Recording EMI or lump sum payments
- Viewing loan ledgers with payment history
- Viewing all loans for a customer

This system is built using modern technologies with a clean, RESTful API, making it suitable for both personal and enterprise-level use cases.

---

## 🛠 Technology Stack

### Frontend
- ⚛ React.js (SPA)
- 🎨 Tailwind CSS (Styling)
- 🌐 Axios (API Calls)

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🔐 UUID (ID generation)
- 🧮 body-parser, dotenv (Middleware)

### Database
- 🐘 PostgreSQL (or SQLite for local testing)
- 🧰 Sequelize ORM (optional)

### Deployment
- 🌍 Netlify (Frontend)
- 🚀 Render / Railway / Vercel (Backend) — Optional

---

## 🧩 Installation Guide

### Prerequisites
- Node.js and npm
- PostgreSQL or SQLite installed

### 1️⃣ Clone Repository

bash

git clone https://github.com/durgaprasad-mokara/Bank-Lending-System.git
cd Bank-Lending-System


2️⃣ Backend Setup

cd server
npm install
# Configure your DB connection in .env
npm start

3️⃣ Frontend Setup

cd client
npm install
npm run dev

🗃 Database Schema (SQL Definitions)
sql

CREATE TABLE Customers (
  customer_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Loans (
  loan_id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES Customers(customer_id),
  principal_amount DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  interest_rate DECIMAL NOT NULL,
  loan_period_years INTEGER NOT NULL,
  monthly_emi DECIMAL NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Payments (
  payment_id TEXT PRIMARY KEY,
  loan_id TEXT REFERENCES Loans(loan_id),
  amount DECIMAL NOT NULL,
  payment_type TEXT CHECK (payment_type IN ('EMI', 'LUMP_SUM')),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


📡 API Documentation
Base URL: /api/v1

📤 Create Loan
POST /loans
json

{
  "customer_id": "string",
  "loan_amount": 100000,
  "loan_period_years": 2,
  "interest_rate_yearly": 5
}
Returns:

json

{
  "loan_id": "uuid",
  "total_amount_payable": 110000,
  "monthly_emi": 4583.33
}

💳 Make a Payment
POST /loans/:loan_id/payments

json

{
  "amount": 4583.33,
  "payment_type": "EMI"
}

Returns:

json
Copy
Edit
{
  "payment_id": "uuid",
  "remaining_balance": 55000,
  "emis_left": 12
}

📒 View Ledger
GET /loans/:loan_id/ledger

json

{
  "loan_id": "string",
  "amount_paid": 45000,
  "balance_amount": 65000,
  "transactions": [
    {
      "transaction_id": "txn-1",
      "amount": 5000,
      "type": "LUMP_SUM"
    }
  ]
}

🧾 Customer Overview
GET /customers/:customer_id/overview

json

{
  "customer_id": "C123",
  "total_loans": 2,
  "loans": [
    {
      "loan_id": "L101",
      "total_amount": 120000,
      "amount_paid": 40000
    }
  ]
}

🧮 Loan Calculation Formulas
Simple Interest (I): I = P × N × R / 100

Total Amount Payable (A): A = P + I

Monthly EMI: EMI = A / (N × 12)

💡 Usage Guide
📋 Add a customer (can be done via DB insert or admin panel)

📝 Create a loan for the customer

💰 Make EMI or lump sum payments as needed

📊 View ledger to track payments and balance

🧾 Get customer overview for all loans

🚀 Deployment Information

✅ Frontend deployed on Netlify

🔗 Live App: https://bank-lending-system-durga.netlify.app/

Backend can be deployed using Render, Netlify Functions, or any Express-compatible host (like Railway, Vercel with custom serverless setup, or even a VPS).

🛡 Security Features
✅ Input validation (amounts, interest rates, required fields)

✅ UUID for secure resource identification

✅ Sanitized DB queries (prevent SQL injection)

✅ CORS-enabled API

📦 Sample Data
sql

INSERT INTO Customers (customer_id, name) VALUES ('C001', 'Durga Prasad');

-- Loan of 1L with 5% for 2 years
INSERT INTO Loans (loan_id, customer_id, principal_amount, interest_rate, loan_period_years, total_amount, monthly_emi)
VALUES ('L001', 'C001', 100000, 5, 2, 110000, 4583.33);

🌱 Future Enhancements
⏳ Support for reducing balance interest method

📆 Scheduled automatic EMI deductions

📥 Admin dashboard for managing loans

🪙 Add authentication for customers

📊 Analytics and charts on payment history

🤝 Contributing
Contributions are welcome! Here's how to get started:

Fork the repository

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m "Add feature"

Push to branch: git push origin feature-name

Create a Pull Request 🎉

🧑‍💻 Maintainer
Made with ❤ by Durga Prasad Mokara

📄 License
This project is licensed under the MIT License.
