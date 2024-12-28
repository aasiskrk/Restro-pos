import { useState } from 'react';
import {
    HomeIcon,
    CreditCardIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    CreditCardIcon as CreditCardIconOutline,
    WalletIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';
import { ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Button } from '../../components/common/Form';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier', current: false },
    { name: 'Checkout', icon: CreditCardIcon, href: '/cashier/checkout', current: false },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history', current: true },
];

// Mock data for transactions
const transactions = [
    {
        id: '#TRX-2025001',
        date: 'Jan 15, 2025 14:30',
        amount: 145.50,
        method: 'Credit Card',
        status: 'completed'
    },
    {
        id: '#TRX-2025002',
        date: 'Jan 15, 2025 15:45',
        amount: 89.00,
        method: 'Digital Wallet',
        status: 'incomplete'
    },
    {
        id: '#TRX-2025003',
        date: 'Jan 15, 2025 16:15',
        amount: 235.75,
        method: 'Cash',
        status: 'completed'
    },
];

const paymentMethods = [
    { id: 'all', name: 'All Methods' },
    { id: 'credit_card', name: 'Credit Card' },
    { id: 'digital_wallet', name: 'Digital Wallet' },
    { id: 'cash', name: 'Cash' },
];

const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'completed', name: 'Completed' },
    { id: 'incomplete', name: 'Incomplete' },
];

export default function PaymentHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const getPaymentMethodIcon = (method) => {
        switch (method.toLowerCase()) {
            case 'credit card':
                return <CreditCardIconOutline className="h-5 w-5 text-gray-400" />;
            case 'digital wallet':
                return <WalletIcon className="h-5 w-5 text-gray-400" />;
            case 'cash':
                return <BanknotesIcon className="h-5 w-5 text-gray-400" />;
            default:
                return null;
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMethod = selectedPaymentMethod === 'all' || transaction.method.toLowerCase().replace(' ', '_') === selectedPaymentMethod;
        const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
        return matchesSearch && matchesMethod && matchesStatus;
    });

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ClockIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Payment History</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    View and manage all payment transactions
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:flex-none">
                        <Button
                            variant="primary"
                            className="inline-flex items-center gap-2"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div>
                        <input
                            type="date"
                            value={selectedDateRange}
                            onChange={(e) => setSelectedDateRange(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <select
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    >
                        {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                                {method.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    >
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Transactions Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredTransactions.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {transaction.id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {transaction.date}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                    ${transaction.amount.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentMethodIcon(transaction.method)}
                                                        {transaction.method}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {transaction.status === 'completed' ? 'Completed' : 'Incomplete'}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        className="text-orange-600 hover:text-orange-900"
                                                        onClick={() => {/* Handle print action */ }}
                                                    >
                                                        <PrinterIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination Info */}
                <div className="mt-4 text-sm text-gray-700">
                    Showing 1 to 10 of 97 results
                </div>
            </div>
        </DashboardLayout>
    );
} 