import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface LoanCalculation {
  totalInterest: number;
  totalAmount: number;
  monthlyEMI: number;
}

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(100000);
  const [years, setYears] = useState<number>(5);
  const [rate, setRate] = useState<number>(10);
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);

  const calculateLoan = (p: number, y: number, r: number): LoanCalculation => {
    const totalInterest = p * y * (r / 100);
    const totalAmount = p + totalInterest;
    const monthlyEMI = totalAmount / (y * 12);
    
    return {
      totalInterest,
      totalAmount,
      monthlyEMI
    };
  };

  useEffect(() => {
    if (principal > 0 && years > 0 && rate >= 0) {
      setCalculation(calculateLoan(principal, years, rate));
    }
  }, [principal, years, rate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Loan Calculator</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1000"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (% per year)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="50"
              step="0.1"
            />
          </div>
        </div>

        {calculation && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calculation Results</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Principal Amount:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-medium text-orange-600">{formatCurrency(calculation.totalInterest)}</span>
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">{formatCurrency(calculation.totalAmount)}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex justify-between">
                  <span className="text-blue-800 font-medium">Monthly EMI:</span>
                  <span className="font-bold text-blue-800 text-lg">{formatCurrency(calculation.monthlyEMI)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;