import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import axios from 'axios';

interface PaymentFormProps {
  onPaymentMade: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentMade }) => {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_type: 'EMI'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        payment_type: formData.payment_type
      };

      const response = await axios.post(
        `http://localhost:3001/api/v1/loans/${formData.loan_id}/payments`,
        payload
      );

      setMessage(`Payment recorded successfully! Remaining balance: ₹${response.data.remaining_balance.toLocaleString('en-IN')}`);
      setFormData({
        loan_id: '',
        amount: '',
        payment_type: 'EMI'
      });
      onPaymentMade();
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Error recording payment');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Record Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan ID
          </label>
          <input
            type="text"
            value={formData.loan_id}
            onChange={(e) => setFormData({ ...formData, loan_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter loan ID"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Payment Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="10000"
              min="1"
              step="1"
              required
            />
            {formData.amount && (
              <p className="text-sm text-gray-500 mt-1">₹{formatCurrency(formData.amount)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <select
              value={formData.payment_type}
              onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="EMI">EMI Payment</option>
              <option value="LUMP_SUM">Lump Sum Payment</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Recording Payment...' : 'Record Payment'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default PaymentForm;