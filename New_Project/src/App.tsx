import React, { useState } from 'react';
import { Banknote, Calculator, Plus, CreditCard, FileText, Users } from 'lucide-react';
import LoanCalculator from './components/LoanCalculator';
import CreateLoan from './components/CreateLoan';
import PaymentForm from './components/PaymentForm';
import LoanLedger from './components/LoanLedger';
import CustomerOverview from './components/CustomerOverview';

type TabType = 'calculator' | 'create' | 'payment' | 'ledger' | 'overview';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'calculator' as TabType, name: 'Loan Calculator', icon: Calculator, color: 'blue' },
    { id: 'create' as TabType, name: 'Create Loan', icon: Plus, color: 'green' },
    { id: 'payment' as TabType, name: 'Record Payment', icon: CreditCard, color: 'purple' },
    { id: 'ledger' as TabType, name: 'Loan Ledger', icon: FileText, color: 'blue' },
    { id: 'overview' as TabType, name: 'Customer Overview', icon: Users, color: 'indigo' }
  ];

  const getTabColorClasses = (tabId: TabType, isActive: boolean) => {
    const tab = tabs.find(t => t.id === tabId);
    const color = tab?.color || 'blue';
    
    if (isActive) {
      return `border-${color}-500 text-${color}-600 bg-${color}-50`;
    }
    return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Banknote className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Bank Lending System</h1>
            </div>
            <div className="text-sm text-gray-500">
              Professional Loan Management Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${getTabColorClasses(tab.id, isActive)}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div key={refreshKey}>
          {activeTab === 'calculator' && <LoanCalculator />}
          {activeTab === 'create' && <CreateLoan onLoanCreated={handleDataChange} />}
          {activeTab === 'payment' && <PaymentForm onPaymentMade={handleDataChange} />}
          {activeTab === 'ledger' && <LoanLedger />}
          {activeTab === 'overview' && <CustomerOverview />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            Bank Lending System - Secure • Reliable • Professional
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;