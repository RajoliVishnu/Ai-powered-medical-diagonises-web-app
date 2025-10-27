import React, { useState } from 'react';
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

interface Transaction {
  id: string;
  date: Date;
  type: 'subscription' | 'consultation' | 'refund' | 'upgrade';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  description: string;
  transactionId: string;
  paymentMethod: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'refunded':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'consultation':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'refund':
        return <DollarSign className="w-5 h-5 text-orange-600" />;
      case 'upgrade':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const statusMatch = filterStatus === 'all' || transaction.status === filterStatus;
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    return statusMatch && typeMatch;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => {
    return transaction.status === 'completed' ? sum + transaction.amount : sum;
  }, 0);

  const downloadReceipt = (transaction: Transaction) => {
    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      transactionId: transaction.transactionId,
      date: transaction.date.toLocaleDateString(),
      amount: `${transaction.currency} ${transaction.amount}`,
      description: transaction.description,
      status: transaction.status,
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="consultation">Consultation</option>
            <option value="refund">Refund</option>
            <option value="upgrade">Upgrade</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No transactions found.</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(transaction.type)}
                    {getStatusIcon(transaction.status)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {transaction.description}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {transaction.date.toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-1" />
                        {transaction.paymentMethod}
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {transaction.transactionId}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  {transaction.status === 'completed' && (
                    <button
                      onClick={() => downloadReceipt(transaction)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download Receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-lg font-semibold text-gray-900">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-lg font-semibold text-green-600">
                {filteredTransactions.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-lg font-semibold text-yellow-600">
                {filteredTransactions.filter(t => t.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-lg font-semibold text-red-600">
                {filteredTransactions.filter(t => t.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 