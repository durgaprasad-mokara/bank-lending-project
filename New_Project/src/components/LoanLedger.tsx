import React, { useState } from 'react';
import { FileText, Calendar, IndianRupee } from 'lucide-react';
import axios from 'axios';

interface Transaction {
  transaction_id: string;
  date: string;
  amount: number;
  type: string;
}

interface LedgerData {
  loan_id: string;
  customer_id: string;
  principal: number;
  total_amount: number;
  monthly_emi: number;
  amount_paid: number;
  balance_amount: number;
  emis_left: number;
  transactions: Transaction[];
}

const LoanLedger: React.FC = () => {
  const [loanId, setLoanId] = useState('');
  const [ledgerData, setLedgerData] = useState<LedgerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLedger = async () => {
    if (!loanId.trim()) return;
    
    setLoading(true);
    setError('');
    setLedgerData(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/v1/loans/${loanId}/ledger`);
      setLedgerData(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error fetching loan ledger');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = () => {
    if (!ledgerData) return 0;
    return (ledgerData.amount_paid / ledgerData.total_amount) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Loan Ledger</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter loan ID"
        />
        <button
          onClick={fetchLedger}
          disabled={loading || !loanId.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Loading...' : 'Get Ledger'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {ledgerData && (
        <div className="space-y-6">
          {/* Loan Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Summary</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-medium">{ledgerData.customer_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Principal Amount</p>
                <p className="font-medium">{formatCurrency(ledgerData.principal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">{formatCurrency(ledgerData.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="font-medium">{formatCurrency(ledgerData.monthly_emi)}</p>
              </div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Progress</h3>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-bold text-green-600 text-lg">{formatCurrency(ledgerData.amount_paid)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance Amount</p>
                  <p className="font-bold text-orange-600 text-lg">{formatCurrency(ledgerData.balance_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EMIs Left</p>
                  <p className="font-bold text-blue-600 text-lg">{ledgerData.emis_left}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
            {ledgerData.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <IndianRupee className="w-4 h-4 inline mr-1" />
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ledgerData.transactions.map((transaction) => (
                      <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'EMI' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {transaction.transaction_id.substring(0, 8)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found for this loan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanLedger;