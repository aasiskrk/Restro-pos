import { useState, useEffect } from 'react';
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
    QrCodeIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Button } from '../../components/common/Form';
import { getAllPayments } from '../../apis/api';
import { toast } from 'react-hot-toast';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier', current: false },
    { name: 'Checkout', icon: CreditCardIcon, href: '/cashier/checkout', current: false },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history', current: true },
];

const paymentMethods = [
    { id: 'all', name: 'All Methods' },
    { id: 'cash', name: 'Cash' },
    { id: 'qr', name: 'QR Code' },
];

const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'completed', name: 'Completed' },
    { id: 'pending', name: 'Pending' },
    { id: 'failed', name: 'Failed' },
];

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// Move getPaymentMethodIcon outside of components so it's accessible to both
const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
        case 'cash':
            return <BanknotesIcon className="h-5 w-5 text-gray-400" />;
        case 'qr':
            return <QrCodeIcon className="h-5 w-5 text-gray-400" />;
        default:
            return null;
    }
};

const ITEMS_PER_PAGE = 8;

function ViewPaymentModal({ isOpen, onClose, payment }) {
    if (!payment) return null;

    const subtotal = payment.orderId.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = payment.amount - subtotal;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            Payment Details
                                        </Dialog.Title>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Transaction #{payment._id.slice(-6)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Payment Information */}
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date & Time</p>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(payment.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Payment Method</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                {getPaymentMethodIcon(payment.paymentMethod)}
                                                <span className="text-sm text-gray-900">{payment.paymentMethod.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.paymentStatus === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : payment.paymentStatus === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {payment.orderId.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-3 text-sm text-gray-900">{item.menuItem.name}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-500 text-center">{item.quantity}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-500 text-right">${item.price.toFixed(2)}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Tax</span>
                                                <span className="text-gray-900">${tax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                                                <span className="text-gray-900">Total Amount</span>
                                                <span className="text-gray-900">${payment.amount.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {payment.transactionDetails && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                {payment.transactionDetails.amountReceived && (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Amount Received</span>
                                                            <span className="text-gray-900">${payment.transactionDetails.amountReceived.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Change</span>
                                                            <span className="text-gray-900">${payment.transactionDetails.change.toFixed(2)}</span>
                                                        </div>
                                                    </>
                                                )}
                                                {payment.transactionDetails.notes && (
                                                    <p className="mt-2 text-sm text-gray-500 italic">
                                                        {payment.transactionDetails.notes}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default function PaymentHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const filters = {
                search: searchQuery,
                paymentMethod: selectedPaymentMethod,
                paymentStatus: selectedStatus,
                startDate: selectedDate,
            };
            const response = await getAllPayments(filters);
            setPayments(response.payments);
            setCurrentPage(1); // Reset to first page when filters change
        } catch (error) {
            console.error('Error fetching payments:', error);
            setError(error.message || 'Failed to fetch payments');
            toast.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPayments();
        }, 300); // Debounce search by 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedDate, selectedPaymentMethod, selectedStatus]);

    // Pagination logic
    const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPayments = payments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrint = async (payment) => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        // Calculate subtotal
        const subtotal = payment.orderId.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const tax = payment.amount - subtotal;

        // Generate receipt HTML
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>DineTrack - Payment Receipt</title>
                <style>
                    @media print {
                        @page {
                            margin: 0;
                            size: 80mm 200mm;
                        }
                    }
                    body { 
                        font-family: 'Arial', sans-serif;
                        margin: 20px;
                        color: #1f2937;
                        line-height: 1.5;
                    }
                    .container {
                        max-width: 400px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header { 
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 20px;
                        border-bottom: 1px dashed #e5e7eb;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #ea580c;
                        margin-bottom: 5px;
                    }
                    .sub-header {
                        font-size: 12px;
                        color: #6b7280;
                        margin-bottom: 15px;
                    }
                    .receipt-info {
                        margin-bottom: 20px;
                        font-size: 14px;
                    }
                    .receipt-info p {
                        margin: 5px 0;
                        display: flex;
                        justify-content: space-between;
                    }
                    .items {
                        margin: 20px 0;
                        border-bottom: 1px dashed #e5e7eb;
                        padding-bottom: 20px;
                    }
                    .items table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 14px;
                    }
                    .items th {
                        text-align: left;
                        padding: 8px 4px;
                        border-bottom: 1px solid #e5e7eb;
                        color: #6b7280;
                    }
                    .items td {
                        padding: 8px 4px;
                    }
                    .items .qty {
                        text-align: center;
                    }
                    .items .price {
                        text-align: right;
                    }
                    .totals {
                        margin-top: 20px;
                        font-size: 14px;
                    }
                    .totals p {
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0;
                    }
                    .total-amount {
                        font-weight: bold;
                        font-size: 16px;
                        border-top: 1px dashed #e5e7eb;
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .payment-info {
                        margin: 20px 0;
                        padding: 15px;
                        background-color: #f9fafb;
                        border-radius: 8px;
                        font-size: 14px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                    }
                    .status-completed {
                        background-color: #dcfce7;
                        color: #166534;
                    }
                    .status-pending {
                        background-color: #fef9c3;
                        color: #854d0e;
                    }
                    .status-failed {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">DineTrack</div>
                        <div class="sub-header">Restaurant Management System</div>
                    </div>

                    <div class="receipt-info">
                        <p>
                            <span>Receipt No:</span>
                            <span>#${payment._id.slice(-6)}</span>
                        </p>
                        <p>
                            <span>Date:</span>
                            <span>${formatDate(payment.createdAt)}</span>
                        </p>
                        <p>
                            <span>Payment Method:</span>
                            <span>${payment.paymentMethod.toUpperCase()}</span>
                        </p>
                        <p>
                            <span>Status:</span>
                            <span class="status-badge status-${payment.paymentStatus}">
                                ${payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                            </span>
                        </p>
                    </div>

                    <div class="items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th class="qty">Qty</th>
                                    <th class="price">Price</th>
                                    <th class="price">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${payment.orderId.items.map(item => `
                                    <tr>
                                        <td>${item.menuItem.name}</td>
                                        <td class="qty">${item.quantity}</td>
                                        <td class="price">$${item.price.toFixed(2)}</td>
                                        <td class="price">$${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="totals">
                        <p>
                            <span>Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </p>
                        <p>
                            <span>Tax:</span>
                            <span>$${tax.toFixed(2)}</span>
                        </p>
                        <p class="total-amount">
                            <span>Total Amount:</span>
                            <span>$${payment.amount.toFixed(2)}</span>
                        </p>
                    </div>

                    ${payment.transactionDetails ? `
                        <div class="payment-info">
                            ${payment.transactionDetails.amountReceived ? `
                                <p>
                                    <span>Amount Received:</span>
                                    <span>$${payment.transactionDetails.amountReceived.toFixed(2)}</span>
                                </p>
                                <p>
                                    <span>Change:</span>
                                    <span>$${payment.transactionDetails.change.toFixed(2)}</span>
                                </p>
                            ` : ''}
                            ${payment.transactionDetails.notes ? `
                                <p style="margin-top: 10px; color: #6b7280; font-style: italic;">
                                    ${payment.transactionDetails.notes}
                                </p>
                            ` : ''}
                        </div>
                    ` : ''}

                    <div class="footer">
                        <p>Thank you for dining with us!</p>
                        <p>Please come again</p>
                        <p style="margin-top: 10px;">
                            Powered by DineTrack
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Write the receipt HTML to the new window and print
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.print();
    };

    if (loading) {
        return (
            <DashboardLayout navigation={navigation}>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout navigation={navigation}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-red-500">{error}</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
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
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
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
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Payment Status</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {paginatedPayments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    #{payment._id.slice(-6)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {formatDate(payment.createdAt)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                    ${payment.amount.toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentMethodIcon(payment.paymentMethod)}
                                                        {payment.paymentMethod.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.paymentStatus === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : payment.paymentStatus === 'failed'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <button
                                                            className="text-blue-600 hover:text-blue-900"
                                                            onClick={() => {
                                                                setSelectedPayment(payment);
                                                                setIsViewModalOpen(true);
                                                            }}
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            className="text-orange-600 hover:text-orange-900"
                                                            onClick={() => handlePrint(payment)}
                                                        >
                                                            <PrinterIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, payments.length)} of {payments.length} results
                    </div>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === page
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

                {/* View Payment Modal */}
                <ViewPaymentModal
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedPayment(null);
                    }}
                    payment={selectedPayment}
                />
            </div>
        </DashboardLayout>
    );
} 