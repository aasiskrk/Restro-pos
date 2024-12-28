import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    CreditCardIcon,
    ClockIcon,
    TableCellsIcon,
    CurrencyDollarIcon,
    XMarkIcon,
    BanknotesIcon,
    QrCodeIcon,
    DocumentTextIcon,
    MagnifyingGlassIcon,
    UsersIcon,
    MinusIcon,
    PlusIcon,
    CalculatorIcon,
    ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import { CreditCardIcon as CreditCardIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Button } from '../../components/common/Form';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier', current: false },
    { name: 'Checkout', icon: CreditCardIcon, href: '/cashier/checkout', current: true },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history', current: false },
];

// Mock data for tables
const tables = [
    {
        id: 'ORD-2025001',
        date: 'Jan 15, 2025 14:30',
        number: 2,
        server: 'Sarah Johnson',
        items: [
            { name: 'Classic Burger', quantity: 2, price: 12.99 },
            { name: 'Caesar Salad', quantity: 1, price: 9.99 },
            { name: 'Iced Coffee', quantity: 2, price: 4.99 }
        ],
        total: 84.50,
        status: 'paid'
    },
    {
        id: 'ORD-2025002',
        date: 'Jan 15, 2025 15:45',
        number: 3,
        server: 'John doe',
        items: [
            { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
            { name: 'Chocolate Lava Cake', quantity: 1, price: 7.99 }
        ],
        total: 21.00,
        status: 'paid'
    },
    {
        id: 'ORD-2025003',
        date: 'Jan 15, 2025 16:20',
        number: 1,
        server: 'Mike doe',
        items: [
            { name: 'Grilled Chicken', quantity: 2, price: 15.99 },
            { name: 'House Salad', quantity: 1, price: 8.99 },
            { name: 'Soft Drinks', quantity: 2, price: 2.99 }
        ],
        total: 21.00,
        status: 'unpaid'
    }
];

function CheckoutModal({ isOpen, onClose, table }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [amountReceived, setAmountReceived] = useState('');
    const [change, setChange] = useState(0);
    const [splitCount, setSplitCount] = useState(1);
    const [tip, setTip] = useState(0);
    const [tipType, setTipType] = useState('percent'); // 'percent' or 'amount'
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'amount'
    const [selectedItems, setSelectedItems] = useState({}); // For split bill item selection

    const paymentMethods = [
        { id: 'cash', name: 'Cash', icon: BanknotesIcon },
        { id: 'card', name: 'Credit Card', icon: CreditCardIcon },
        { id: 'mobile', name: 'Mobile Payment', icon: QrCodeIcon },
    ];

    const tipOptions = [
        { value: 0, label: 'No Tip' },
        { value: 10, label: '10%' },
        { value: 15, label: '15%' },
        { value: 20, label: '20%' },
    ];

    const calculateSubtotal = (items) => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const calculateTip = (subtotal) => {
        if (tipType === 'percent') {
            return subtotal * (tip / 100);
        }
        return parseFloat(tip) || 0;
    };

    const calculateDiscount = (subtotal) => {
        if (discountType === 'percent') {
            return subtotal * (discount / 100);
        }
        return parseFloat(discount) || 0;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal(table.items);
        const tipAmount = calculateTip(subtotal);
        const discountAmount = calculateDiscount(subtotal);
        const tax = subtotal * 0.08;
        return (subtotal + tipAmount + tax - discountAmount) / splitCount;
    };

    const handleAmountReceivedChange = (value) => {
        setAmountReceived(value);
        const numValue = parseFloat(value) || 0;
        setChange(Math.max(0, numValue - calculateTotal()));
    };

    const handleSplitBill = (direction) => {
        const newCount = direction === 'increase' ? splitCount + 1 : Math.max(1, splitCount - 1);
        setSplitCount(newCount);
        // Reset item selection when changing split count
        setSelectedItems({});
    };

    const toggleItemSelection = (itemIndex, splitIndex) => {
        setSelectedItems(prev => ({
            ...prev,
            [`${itemIndex}-${splitIndex}`]: !prev[`${itemIndex}-${splitIndex}`]
        }));
    };

    const handlePayment = () => {
        // Handle payment processing here
        console.log('Processing payment:', {
            table,
            paymentMethod: selectedPaymentMethod,
            amountReceived: parseFloat(amountReceived),
            change
        });
        onClose();
    };

    const inputBaseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm";
    const buttonBaseClasses = "inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

    if (!table) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
                    >
                        <div className="relative bg-white rounded-xl shadow-xl max-w-7xl w-full">
                            <div className="flex flex-col max-h-[90vh]">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
                                            <p className="mt-1 text-sm text-gray-500">Table #{table.number}</p>
                                        </div>
                                        <button onClick={onClose}>
                                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-8">
                                    <div className="grid grid-cols-[1fr,400px] gap-8">
                                        {/* Left Column - Order Details */}
                                        <div className="space-y-8">
                                            {/* Split Bill Controls */}
                                            <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-100">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">Split Bill</h3>
                                                        <p className="text-sm text-gray-500 mt-1">Divide the bill between multiple people</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white rounded-lg p-2 border border-gray-200 shadow-sm">
                                                        <button
                                                            onClick={() => handleSplitBill('decrease')}
                                                            className={`${buttonBaseClasses} ${splitCount <= 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                                                            disabled={splitCount <= 1}
                                                        >
                                                            <MinusIcon className="h-5 w-5" />
                                                        </button>
                                                        <div className="flex items-center gap-2 px-3">
                                                            <UsersIcon className="h-5 w-5 text-orange-500" />
                                                            <span className="text-lg font-medium text-gray-900 min-w-[1.5rem] text-center">{splitCount}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleSplitBill('increase')}
                                                            className={`${buttonBaseClasses} text-gray-700 hover:bg-gray-50`}
                                                        >
                                                            <PlusIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                                                <div className="bg-gray-50 rounded-lg p-6">
                                                    <div className="space-y-4">
                                                        {table.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between items-center">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        {splitCount > 1 && (
                                                                            <div className="flex gap-1.5">
                                                                                {[...Array(splitCount)].map((_, splitIndex) => (
                                                                                    <button
                                                                                        key={splitIndex}
                                                                                        onClick={() => toggleItemSelection(index, splitIndex)}
                                                                                        className={`w-7 h-7 rounded-full text-xs flex items-center justify-center border shadow-sm transition-all duration-200 ${selectedItems[`${index}-${splitIndex}`]
                                                                                            ? 'bg-orange-500 text-white border-orange-500 ring-2 ring-orange-200'
                                                                                            : 'bg-white text-gray-500 border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                                                                                            }`}
                                                                                    >
                                                                                        {splitIndex + 1}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        <p className="font-medium text-gray-900">
                                                                            {item.quantity}x {item.name}
                                                                        </p>
                                                                    </div>
                                                                    <p className="text-sm text-gray-500">
                                                                        ${item.price.toFixed(2)} each
                                                                    </p>
                                                                </div>
                                                                <p className="font-medium text-gray-900">
                                                                    ${(item.quantity * item.price).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Calculations */}
                                                    <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-gray-600">Subtotal</p>
                                                            <p className="font-medium text-gray-900">
                                                                ${calculateSubtotal(table.items).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        {/* Tip Section - Streamlined */}
                                                        <div className="flex items-center justify-between gap-4 bg-gray-100/50 rounded-lg p-4 border border-gray-200">
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <p className="font-medium text-gray-900 whitespace-nowrap">Tip</p>
                                                                <div className="flex gap-2">
                                                                    {tipOptions.map((option) => (
                                                                        <button
                                                                            key={option.value}
                                                                            onClick={() => {
                                                                                setTip(option.value);
                                                                                setTipType('percent');
                                                                            }}
                                                                            className={`${buttonBaseClasses} px-4 ${tip === option.value && tipType === 'percent'
                                                                                ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200'
                                                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                                }`}
                                                                        >
                                                                            {option.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <div className="relative w-28">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        value={tipType === 'amount' ? tip : ''}
                                                                        onChange={(e) => {
                                                                            setTip(e.target.value);
                                                                            setTipType('amount');
                                                                        }}
                                                                        placeholder="Custom"
                                                                        className={`${inputBaseClasses} pl-7`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className="font-medium text-gray-900 whitespace-nowrap">
                                                                ${calculateTip(calculateSubtotal(table.items)).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        {/* Discount Section - Streamlined */}
                                                        <div className="flex items-center justify-between gap-4 bg-gray-100/50 rounded-lg p-4 border border-gray-200">
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <p className="font-medium text-gray-900 whitespace-nowrap">Discount</p>
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="relative w-32">
                                                                        <input
                                                                            type="number"
                                                                            value={discount}
                                                                            onChange={(e) => setDiscount(e.target.value)}
                                                                            className={inputBaseClasses}
                                                                            placeholder="Enter discount"
                                                                        />
                                                                    </div>
                                                                    <select
                                                                        value={discountType}
                                                                        onChange={(e) => setDiscountType(e.target.value)}
                                                                        className={`${inputBaseClasses} w-20`}
                                                                    >
                                                                        <option value="percent">%</option>
                                                                        <option value="amount">$</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <p className="font-medium text-gray-900 whitespace-nowrap">
                                                                -${calculateDiscount(calculateSubtotal(table.items)).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <p className="text-gray-600">Tax (8%)</p>
                                                            <p className="font-medium text-gray-900">
                                                                ${(calculateSubtotal(table.items) * 0.08).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        {splitCount > 1 && (
                                                            <div className="pt-4 border-t border-gray-200">
                                                                <div className="flex justify-between items-center text-lg font-semibold">
                                                                    <p className="text-gray-900">Total per person</p>
                                                                    <p className="text-orange-600">
                                                                        ${calculateTotal().toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="pt-4 border-t border-gray-200">
                                                            <div className="flex justify-between items-center text-lg font-semibold">
                                                                <p className="text-gray-900">Total{splitCount > 1 ? ' (all)' : ''}</p>
                                                                <p className="text-orange-600">
                                                                    ${(calculateTotal() * splitCount).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Payment Details */}
                                        <div className="space-y-8">
                                            {/* Payment Method */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {paymentMethods.map((method) => (
                                                        <button
                                                            key={method.id}
                                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                                            className={`flex items-center justify-between p-4 rounded-lg border shadow-sm transition-all duration-200 ${selectedPaymentMethod === method.id
                                                                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                                                                : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <method.icon
                                                                    className={`h-6 w-6 ${selectedPaymentMethod === method.id
                                                                        ? 'text-orange-600'
                                                                        : 'text-gray-400'
                                                                        }`}
                                                                />
                                                                <span className="text-base font-medium text-gray-900">
                                                                    {method.name}
                                                                </span>
                                                            </div>
                                                            {selectedPaymentMethod === method.id && (
                                                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Cash Payment Details */}
                                            {selectedPaymentMethod === 'cash' && (
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Cash Details</h3>
                                                    <div className="bg-gray-100/50 rounded-lg p-6 border border-gray-200">
                                                        <div className="space-y-6">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Amount Received
                                                                </label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                                    </div>
                                                                    <input
                                                                        type="number"
                                                                        value={amountReceived}
                                                                        onChange={(e) => handleAmountReceivedChange(e.target.value)}
                                                                        className={`${inputBaseClasses} pl-7 text-lg`}
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Change
                                                                </label>
                                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                                    <p className="text-3xl font-bold text-gray-900">
                                                                        ${change.toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={handlePayment}
                                            disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'cash' && !amountReceived)}
                                        >
                                            Complete Payment
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function Checkout() {
    const [selectedTable, setSelectedTable] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCheckout = (table) => {
        setSelectedTable(table);
        setShowCheckout(true);
    };

    const filteredTables = tables.filter(table =>
        table.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        table.server.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `Table ${table.number}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <CreditCardIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Process payments for tables
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Table</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Server</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredTables.map((table) => (
                                            <tr key={table.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{table.id}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{table.date}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <TableCellsIcon className="h-5 w-5 text-blue-600" />
                                                        Table {table.number}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{table.server}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span>{table.items.length} items</span>
                                                        <span className="text-xs text-gray-400">
                                                            {table.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                                        {table.total.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${table.status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {table.status === 'paid' ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleCheckout(table)}
                                                        disabled={table.status === 'paid'}
                                                        className="inline-flex items-center gap-1"
                                                    >
                                                        <CreditCardIcon className="h-4 w-4" />
                                                        {table.status === 'paid' ? 'Paid' : 'Checkout'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Modal */}
                <CheckoutModal
                    isOpen={showCheckout}
                    onClose={() => {
                        setShowCheckout(false);
                        setSelectedTable(null);
                    }}
                    table={selectedTable}
                />
            </div>
        </DashboardLayout>
    );
} 