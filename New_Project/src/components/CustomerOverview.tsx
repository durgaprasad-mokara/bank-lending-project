import React, { useState } from 'react';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Loan {
  loan_id: string;
  principal: number;
  total_amount: number;
  total_interest: number;
  emi_amount: number;
  amount_paid: number;
  emis_left: number;
  status: string;
}

interface CustomerOverviewData {
  customer_id: string;
  total_loans: number;
  loans: Loan[];
}

const CustomerOverview: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [overviewData, setOverviewData] = useState<CustomerOverviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOverview = async () => {
    if (!customerId.trim()) return;
    
    setLoading(true);
    setError('');
    setOverviewData(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/v1/customers/${customerId}/overview`);
      setOverviewData(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error fetching customer overview');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalValues = () => {
    if (!overviewData) return { totalPrincipal: 0, totalPaid: 0, totalBalance: 0 };
    
    return overviewData.loans.reduce((acc, loan) => ({
      totalPrincipal: acc.totalPrincipal + loan.principal,
      totalPaid: acc.totalPaid + loan.amount_paid,
      totalBalance: acc.totalBalance + (loan.total_amount - loan.amount_paid)
    }), { totalPrincipal: 0, totalPaid: 0, totalBalance: 0 });
  };

  const getStatusColor = (status: string) => {
    return status === 'PAID_OFF' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Customer Overview</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter customer ID (e.g., CUST001)"
        />
        <button
          onClick={fetchOverview}
          disabled={loading || !customerId.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : 'Get Overview'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {overviewData && (
        <div className="space-y-6">
          {/* Customer Summary */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Summary</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Loans</p>
                <p className="font-bold text-2xl text-indigo-600">{overviewData.total_loans}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Principal</p>
                <p className="font-bold text-lg">{formatCurrency(getTotalValues().totalPrincipal)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="font-bold text-lg text-green-600">{formatCurrency(getTotalValues().totalPaid)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="font-bold text-lg text-orange-600">{formatCurrency(getTotalValues().totalBalance)}</p>
              </div>
            </div>
          </div>

          {/* Loans Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Loan Details
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMI Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMIs Left
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overviewData.loans.map((loan) => (
                    <tr key={loan.loan_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {loan.loan_id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(loan.principal)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(loan.total_amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(loan.emi_amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(loan.amount_paid)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.emis_left}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOverview;