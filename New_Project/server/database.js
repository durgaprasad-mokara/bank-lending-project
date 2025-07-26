import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'banking.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create Customers table
      db.run(`CREATE TABLE IF NOT EXISTS customers (
        customer_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Loans table
      db.run(`CREATE TABLE IF NOT EXISTS loans (
        loan_id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        principal_amount DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        loan_period_years INTEGER NOT NULL,
        monthly_emi DECIMAL(15,2) NOT NULL,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      )`);

      // Create Payments table
      db.run(`CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        loan_id TEXT NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        payment_type TEXT NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
      )`, (err) => {
        if (err) {
          reject(err);
        } else {
          // Insert sample customers
          const sampleCustomers = [
            ['CUST001', 'John Doe'],
            ['CUST002', 'Jane Smith'],
            ['CUST003', 'Bob Johnson']
          ];

          const insertCustomer = db.prepare('INSERT OR IGNORE INTO customers (customer_id, name) VALUES (?, ?)');
          sampleCustomers.forEach(customer => {
            insertCustomer.run(customer);
          });
          insertCustomer.finalize();

          resolve();
        }
      });
    });
  });
};

export const getCustomers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM customers ORDER BY name', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const createLoan = (loanData) => {
  return new Promise((resolve, reject) => {
    const { loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi } = loanData;
    
    db.run(
      `INSERT INTO loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi],
      function(err) {
        if (err) reject(err);
        else resolve({ loan_id });
      }
    );
  });
};

export const getLoan = (loanId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM loans WHERE loan_id = ?', [loanId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const createPayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    const { payment_id, loan_id, amount, payment_type } = paymentData;
    
    db.run(
      'INSERT INTO payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)',
      [payment_id, loan_id, amount, payment_type],
      function(err) {
        if (err) reject(err);
        else resolve({ payment_id });
      }
    );
  });
};

export const getPayments = (loanId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date DESC',
      [loanId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const getCustomerLoans = (customerId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM loans WHERE customer_id = ? ORDER BY created_at DESC',
      [customerId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

export const getTotalPayments = (loanId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE loan_id = ?',
      [loanId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      }
    );
  });
};

export { db };