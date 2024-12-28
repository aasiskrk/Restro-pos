import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    CreditCardIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    TableCellsIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/admin/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier', current: true },
    { name: 'Checkout', icon: CreditCardIcon, href: '/cashier/checkout', current: false },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history', current: false },
];

// Mock data for quick stats
const quickStats = [
    {
        name: 'Total Sales Today',
        value: '$1,245.89',
        icon: CurrencyDollarIcon,
        change: '+12.5%',
        changeType: 'positive',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600'
    },
    {
        name: 'Pending Payments',
        value: '5',
        icon: TableCellsIcon,
        change: '3 tables',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-600'
    },
    {
        name: 'Average Order Value',
        value: '$42.50',
        icon: ChartBarIcon,
        change: '+5.2%',
        changeType: 'positive',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600'
    }
];

// Mock data for recent transactions
const recentTransactions = [
    {
        id: 'TRX-001',
        table: 'Table 4',
        amount: 85.50,
        time: '5 minutes ago',
        status: 'completed',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'TRX-002',
        table: 'Table 2',
        amount: 45.00,
        time: '15 minutes ago',
        status: 'completed',
        paymentMethod: 'Cash'
    },
    {
        id: 'TRX-003',
        table: 'Table 7',
        amount: 120.75,
        time: '30 minutes ago',
        status: 'completed',
        paymentMethod: 'Credit Card'
    }
];

export default function CashierInterface() {
    return (
        <DashboardLayout navigation={navigation}>
            <div className="min-h-screen bg-gray-50/30">
                <div className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">Cashier Dashboard</h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Overview of sales, pending payments, and recent transactions
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quickStats.map((stat) => (
                                <motion.div
                                    key={stat.name}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                            <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.name}</p>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{stat.value}</h3>
                                                {stat.change && (
                                                    <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-500'
                                                        }`}>
                                                        {stat.change}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Transactions */}
                        <div className="mt-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {recentTransactions.map((transaction) => (
                                        <li key={transaction.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-full ${transaction.paymentMethod === 'Credit Card'
                                                        ? 'bg-blue-100'
                                                        : 'bg-green-100'
                                                        }`}>
                                                        {transaction.paymentMethod === 'Credit Card' ? (
                                                            <CreditCardIcon className={`h-5 w-5 ${transaction.paymentMethod === 'Credit Card'
                                                                ? 'text-blue-600'
                                                                : 'text-green-600'
                                                                }`} />
                                                        ) : (
                                                            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {transaction.table}
                                                            </p>
                                                            <span className="text-sm text-gray-500">
                                                                • {transaction.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {transaction.paymentMethod}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ${transaction.amount.toFixed(2)}
                                                    </p>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {transaction.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 