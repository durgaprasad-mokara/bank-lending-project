import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

import {
  initDatabase,
  getCustomers,
  createLoan,
  getLoan,
  createPayment,
  getPayments,
  getCustomerLoans,
  getTotalPayments
} from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// Utility function to calculate loan details
const calculateLoanDetails = (principal, years, rate) => {
  const totalInterest = principal * years * (rate / 100);
  const totalAmount = principal + totalInterest;
  const monthlyEMI = totalAmount / (years * 12);
  
  return {
    totalInterest,
    totalAmount,
    monthlyEMI
  };
};

// API Routes

// Get all customers
app.get('/api/v1/customers', async (req, res) => {
  try {
    const customers = await getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// LEND: Create a new loan
app.post('/api/v1/loans', async (req, res) => {
  try {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

    // Validate input
    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (loan_amount <= 0 || loan_period_years <= 0 || interest_rate_yearly < 0) {
      return res.status(400).json({ error: 'Invalid input values' });
    }

    const loan_id = uuidv4();
    const { totalAmount, monthlyEMI } = calculateLoanDetails(
      loan_amount,
      loan_period_years,
      interest_rate_yearly
    );

    const loanData = {
      loan_id,
      customer_id,
      principal_amount: loan_amount,
      total_amount: totalAmount,
      interest_rate: interest_rate_yearly,
      loan_period_years,
      monthly_emi: monthlyEMI
    };

    await createLoan(loanData);

    res.status(201).json({
      loan_id,
      customer_id,
      total_amount_payable: totalAmount,
      monthly_emi: monthlyEMI
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

// PAYMENT: Record a payment for a loan
app.post('/api/v1/loans/:loan_id/payments', async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;

    // Validate input
    if (!amount || !payment_type) {
      return res.status(400).json({ error: 'Amount and payment type are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Payment amount must be positive' });
    }

    // Check if loan exists
    const loan = await getLoan(loan_id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const payment_id = uuidv4();
    await createPayment({
      payment_id,
      loan_id,
      amount,
      payment_type: payment_type.toUpperCase()
    });

    // Calculate remaining balance and EMIs
    const totalPaid = await getTotalPayments(loan_id);
    const remainingBalance = Math.max(0, loan.total_amount - totalPaid);
    const emisLeft = remainingBalance > 0 ? Math.ceil(remainingBalance / loan.monthly_emi) : 0;

    res.json({
      payment_id,
      loan_id,
      message: 'Payment recorded successfully',
      remaining_balance: remainingBalance,
      emis_left: emisLeft
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// LEDGER: View loan details and transaction history
app.get('/api/v1/loans/:loan_id/ledger', async (req, res) => {
  try {
    const { loan_id } = req.params;

    const loan = await getLoan(loan_id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const payments = await getPayments(loan_id);
    const totalPaid = await getTotalPayments(loan_id);
    const remainingBalance = Math.max(0, loan.total_amount - totalPaid);
    const emisLeft = remainingBalance > 0 ? Math.ceil(remainingBalance / loan.monthly_emi) : 0;

    // Format transactions
    const transactions = payments.map(payment => ({
      transaction_id: payment.payment_id,
      date: payment.payment_date,
      amount: payment.amount,
      type: payment.payment_type
    }));

    res.json({
      loan_id,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid: totalPaid,
      balance_amount: remainingBalance,
      emis_left: emisLeft,
      transactions
    });
  } catch (error) {
    console.error('Error fetching ledger:', error);
    res.status(500).json({ error: 'Failed to fetch loan ledger' });
  }
});

// ACCOUNT OVERVIEW: View all loans for a customer
app.get('/api/v1/customers/:customer_id/overview', async (req, res) => {
  try {
    const { customer_id } = req.params;

    const loans = await getCustomerLoans(customer_id);
    if (loans.length === 0) {
      return res.status(404).json({ error: 'No loans found for this customer' });
    }

    // Calculate details for each loan
    const loanDetails = await Promise.all(
      loans.map(async (loan) => {
        const totalPaid = await getTotalPayments(loan.loan_id);
        const remainingBalance = Math.max(0, loan.total_amount - totalPaid);
        const emisLeft = remainingBalance > 0 ? Math.ceil(remainingBalance / loan.monthly_emi) : 0;
        const totalInterest = loan.total_amount - loan.principal_amount;

        return {
          loan_id: loan.loan_id,
          principal: loan.principal_amount,
          total_amount: loan.total_amount,
          total_interest: totalInterest,
          emi_amount: loan.monthly_emi,
          amount_paid: totalPaid,
          emis_left: emisLeft,
          status: remainingBalance <= 0 ? 'PAID_OFF' : 'ACTIVE'
        };
      })
    );

    res.json({
      customer_id,
      total_loans: loans.length,
      loans: loanDetails
    });
  } catch (error) {
    console.error('Error fetching customer overview:', error);
    res.status(500).json({ error: 'Failed to fetch customer overview' });
  }
});

app.listen(PORT, () => {
  console.log(`Bank Lending API server running on port ${PORT}`);
});