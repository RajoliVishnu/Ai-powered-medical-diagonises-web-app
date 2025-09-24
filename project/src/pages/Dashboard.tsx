import React, { useState } from 'react';
import { CreditCard, Calendar, FileText, Pill, CheckCircle, DollarSign, TrendingUp, Users, Shield, Activity, Clock } from 'lucide-react';

interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedConsultations: number;
  totalSpent: number;
  activePrescriptions: number;
  medicalRecords: number;
}

const Dashboard: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    totalAppointments: 12,
    upcomingAppointments: 3,
    completedConsultations: 8,
    totalSpent: 450.00,
    activePrescriptions: 5,
    medicalRecords: 15,
  });

  const recentTransactions = [
    {
      id: '1',
      type: 'subscription',
      amount: 19.99,
      date: new Date(),
      status: 'completed',
      description: 'Premium Plan Renewal',
    },
    {
      id: '2',
      type: 'consultation',
      amount: 150.00,
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      description: 'Cardiology Consultation',
    },
    {
      id: '3',
      type: 'consultation',
      amount: 120.00,
      date: new Date(Date.now() - 172800000),
      status: 'completed',
      description: 'Dermatology Consultation',
    },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: new Date(Date.now() + 86400000),
      time: '10:00 AM',
      type: 'Video Consultation',
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      date: new Date(Date.now() + 172800000),
      time: '2:00 PM',
      type: 'In-Person',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <CreditCard className="w-4 h-4" />;
      case 'consultation':
        return <Calendar className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your healthcare journey.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Consultations Used</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Pill className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePrescriptions}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Status */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Subscription Status</h2>
                <a href="/subscription" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Manage</a>
              </div>

              <div className="text-center py-6">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">No active subscription</p>
                <a href="/subscription" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Choose a Plan
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a href="/appointments" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Book Appointment</span>
                </a>

                <a href="/medical-records" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <FileText className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Records</span>
                </a>

                <a href="/prescriptions" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <Pill className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Prescriptions</span>
                </a>

                <a href="/doctors" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <Users className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Find Doctors</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <a href="/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</a>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{appointment.date.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{appointment.time}</span>
                        <span>•</span>
                        <span>{appointment.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
              <a href="/subscription" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</a>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${transaction.amount}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Health Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Activity className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Consultation Trend</h3>
                <p className="text-2xl font-bold text-blue-600">+15%</p>
                <p className="text-sm text-gray-600">vs last month</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Health Score</h3>
                <p className="text-2xl font-bold text-green-600">85/100</p>
                <p className="text-sm text-gray-600">Good health</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Next Checkup</h3>
                <p className="text-2xl font-bold text-purple-600">30 days</p>
                <p className="text-sm text-gray-600">Recommended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 