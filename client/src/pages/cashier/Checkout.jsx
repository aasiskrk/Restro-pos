import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    EyeIcon,
} from '@heroicons/react/24/outline';
import { CreditCardIcon as CreditCardIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Button } from '../../components/common/Form';
import { getAllOrders, processCashPayment, processQRPayment } from '../../apis/api';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier', current: false },
    { name: 'Checkout', icon: CreditCardIcon, href: '/cashier/checkout', current: true },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history', current: false },
];

function QRModal({ isOpen, onClose, totalAmount, orderId, onPaymentComplete }) {
    const handleQRPayment = async () => {
        try {
            const paymentResponse = await processQRPayment({
                orderId: orderId,
                amount: totalAmount,
                paymentStatus: 'paid'
            });

            if (paymentResponse.success) {
                onPaymentComplete();
                onClose();
                toast.success('Payment processed successfully');
            } else {
                throw new Error(paymentResponse.message || 'Failed to process QR payment');
            }
        } catch (error) {
            console.error('QR payment error:', error);
            toast.error(error.message || 'Failed to process QR payment. Please try again.');
        }
    };

    if (!isOpen) return null;

    const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
        encodeURIComponent(`Payment for Order #${orderId.slice(-6)} - Amount: $${totalAmount}`);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Scan QR Code to Pay</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                                <span>Order ID:</span>
                                <span className="font-medium">#{orderId.slice(-6)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span className="font-medium">{formatCurrency(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="text-orange-600 font-medium">Pending Payment</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                            <img src={qrCodeUrl} alt="Payment QR Code" className="w-64 h-64" />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-6 text-center">
                        Scan this QR code with your mobile payment app to complete the payment
                    </p>

                    <div className="flex justify-between gap-3">
                        <button
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                            onClick={handleQRPayment}
                        >
                            Confirm Payment
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function CheckoutModal({ isOpen, onClose, table, onPaymentComplete }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [amountReceived, setAmountReceived] = useState('');
    const [change, setChange] = useState(0);
    const [splitCount, setSplitCount] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState('percent');
    const [selectedItems, setSelectedItems] = useState({});
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);

    const paymentMethods = [
        { id: 'cash', name: 'Cash', icon: BanknotesIcon },
        { id: 'qr', name: 'QR Code Payment', icon: QrCodeIcon },
    ];

    const calculateSubtotal = (items) => {
        if (!items) return 0;
        return items.reduce((sum, item) => {
            const price = item.menuItem?.price || item.price || 0;
            return sum + (item.quantity * price);
        }, 0);
    };

    const calculateDiscount = (subtotal) => {
        if (discountType === 'percent') {
            return subtotal * (discount / 100);
        }
        return parseFloat(discount) || 0;
    };

    const calculateTax = (subtotal) => {
        return subtotal * 0.08; // 8% tax
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal(table.items);
        const discountAmount = calculateDiscount(subtotal);
        const tax = calculateTax(subtotal);
        return subtotal + tax - discountAmount;
    };

    const calculatePerPersonAmount = () => {
        return calculateTotal() / splitCount;
    };

    const handleAmountReceivedChange = (value) => {
        setAmountReceived(value);
        const numValue = parseFloat(value) || 0;
        setChange(Math.max(0, numValue - calculateTotal()));
    };

    const handleSplitBill = (direction) => {
        const newCount = direction === 'increase' ? splitCount + 1 : Math.max(1, splitCount - 1);
        setSplitCount(newCount);
        setSelectedItems({});
    };

    const toggleItemSelection = (itemIndex, splitIndex) => {
        setSelectedItems(prev => ({
            ...prev,
            [`${itemIndex}-${splitIndex}`]: !prev[`${itemIndex}-${splitIndex}`]
        }));
    };

    const handlePayment = async () => {
        try {
            const totalAmount = calculateTotal();
            const receivedAmount = parseFloat(amountReceived);

            // Validate cash payment amount
            if (selectedPaymentMethod === 'cash') {
                if (!receivedAmount || receivedAmount < totalAmount) {
                    toast.error('Received amount must be equal to or greater than the total amount');
                    return;
                }
            }

            setPaymentProcessing(true);
            setPaymentError(null);

            const paymentData = {
                orderId: table._id,
                amount: totalAmount,
                amountReceived: receivedAmount,
                change: change,
                paymentStatus: 'paid',
                splitCount: splitCount,
                discount: {
                    amount: calculateDiscount(calculateSubtotal(table.items)),
                    type: discountType,
                    percentage: discountType === 'percent' ? discount : null
                },
                tax: calculateTax(calculateSubtotal(table.items))
            };

            if (selectedPaymentMethod === 'cash') {
                const paymentResponse = await processCashPayment(paymentData);

                if (paymentResponse.success) {
                    onPaymentComplete();
                    onClose();
                    toast.success('Payment processed successfully');
                } else {
                    throw new Error(paymentResponse.message || 'Failed to process cash payment');
                }
            } else if (selectedPaymentMethod === 'qr') {
                setShowQRModal(true);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to process payment. Please try again.');
            setPaymentError(error.message || 'Failed to process payment. Please try again.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const inputBaseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm";
    const buttonBaseClasses = "inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

    if (!table) return null;

    return (
        <>
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
                                                <h2 className="text-xl font-semibold text-gray-900">Process Payment</h2>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Table {table?.table?.number || 'Loading...'}
                                                </p>
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
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {splitCount > 1
                                                                    ? `Splitting ${formatCurrency(calculateTotal())} between ${splitCount} people`
                                                                    : 'Divide the bill between multiple people'}
                                                            </p>
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
                                                                <span className="text-lg font-medium text-gray-900 min-w-[1.5rem] text-center">
                                                                    {splitCount}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleSplitBill('increase')}
                                                                className={`${buttonBaseClasses} text-gray-700 hover:bg-gray-50`}
                                                            >
                                                                <PlusIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {splitCount > 1 && (
                                                        <div className="mt-2 p-3 bg-white rounded-lg border border-orange-100">
                                                            <p className="text-sm text-gray-600">
                                                                Each person pays: <span className="font-medium text-orange-600">{formatCurrency(calculatePerPersonAmount())}</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Order Summary with enhanced UI */}
                                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                                    <div className="p-4 border-b border-gray-200">
                                                        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                                                    </div>
                                                    <div className="p-4 space-y-4">
                                                        {table.items?.map((item, index) => (
                                                            <div key={index} className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {formatCurrency(item.menuItem?.price || item.price || 0)} each
                                                                    </p>
                                                                </div>
                                                                <p className="font-medium text-gray-900">
                                                                    {formatCurrency((item.menuItem?.price || item.price || 0) * item.quantity)}
                                                                </p>
                                                            </div>
                                                        ))}

                                                        <div className="pt-4 space-y-3 border-t border-gray-200">
                                                            <div className="flex justify-between text-gray-600">
                                                                <span>Subtotal</span>
                                                                <span>{formatCurrency(calculateSubtotal(table.items))}</span>
                                                            </div>
                                                            <div className="flex justify-between text-gray-600">
                                                                <span>Tax (8%)</span>
                                                                <span>{formatCurrency(calculateTax(calculateSubtotal(table.items)))}</span>
                                                            </div>
                                                            {discount > 0 && (
                                                                <div className="flex justify-between text-red-600">
                                                                    <span>Discount ({discountType === 'percent' ? `${discount}%` : 'Custom'})</span>
                                                                    <span>-{formatCurrency(calculateDiscount(calculateSubtotal(table.items)))}</span>
                                                                </div>
                                                            )}
                                                            <div className="pt-3 border-t border-gray-200">
                                                                <div className="flex justify-between text-lg font-semibold">
                                                                    <span>Total</span>
                                                                    <span className="text-orange-600">{formatCurrency(calculateTotal())}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column - Payment Details */}
                                            <div className="space-y-8">
                                                {/* Payment Method Selection */}
                                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                                    <div className="p-4 border-b border-gray-200">
                                                        <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                                                    </div>
                                                    <div className="p-4">
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
                                                                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Cash Payment Details */}
                                                {selectedPaymentMethod === 'cash' && (
                                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                                        <div className="p-4 border-b border-gray-200">
                                                            <h3 className="text-lg font-medium text-gray-900">Cash Details</h3>
                                                        </div>
                                                        <div className="p-4 space-y-4">
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
                                                                        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-orange-500 focus:ring-orange-500 text-lg"
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Change
                                                                </label>
                                                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                                    <p className="text-3xl font-bold text-gray-900">
                                                                        {formatCurrency(change)}
                                                                    </p>
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
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                {splitCount > 1 ? (
                                                    <p>Total payment: {formatCurrency(calculateTotal())} ({splitCount} x {formatCurrency(calculatePerPersonAmount())})</p>
                                                ) : (
                                                    <p>Total payment: {formatCurrency(calculateTotal())}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-3">
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
                            </div>
                        </motion.div>

                        {/* Add payment processing overlay */}
                        {paymentProcessing && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
                                    <p className="mt-4 text-center text-gray-700">Processing payment...</p>
                                </div>
                            </div>
                        )}

                        {/* Add payment error message */}
                        {paymentError && (
                            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
                                <p>{paymentError}</p>
                                <button
                                    onClick={() => setPaymentError(null)}
                                    className="absolute top-2 right-2 text-red-700"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </AnimatePresence>
            <QRModal
                isOpen={showQRModal}
                onClose={() => setShowQRModal(false)}
                totalAmount={calculateTotal() * splitCount}
                orderId={table?._id}
                onPaymentComplete={() => {
                    onPaymentComplete();
                    onClose();
                }}
            />
        </>
    );
}

function OrderDetailsModal({ isOpen, onClose, order }) {
    if (!order) return null;

    const isPaid = order.paymentStatus === 'paid';

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
                        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {isPaid ? 'Order & Payment Details' : 'Order Details'}
                                    </h3>
                                    <button onClick={onClose}>
                                        <XMarkIcon className="h-6 w-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    {/* Order Information Section */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Order Information</h4>
                                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Order ID</p>
                                                <p className="mt-1">#{order._id.slice(-6)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Table Number</p>
                                                <p className="mt-1">Table {order.table?.number}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                                                <p className="mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Status</p>
                                                <p className="mt-1 capitalize">{order.status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information Section */}
                                    {isPaid && order.payment && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Information</h4>
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <p className="text-sm text-gray-600">Payment Method</p>
                                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                                            {order.payment.paymentMethod}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm text-gray-600">Payment Status</p>
                                                        <p className="text-sm font-medium text-green-600 capitalize">
                                                            {order.payment.paymentStatus}
                                                        </p>
                                                    </div>
                                                    {order.payment.transactionId && (
                                                        <div className="flex justify-between">
                                                            <p className="text-sm text-gray-600">Transaction ID</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {order.payment.transactionId}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {order.payment.transactionDetails && (
                                                        <>
                                                            <div className="flex justify-between">
                                                                <p className="text-sm text-gray-600">Amount Received</p>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    ${order.payment.transactionDetails.amountReceived?.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="text-sm text-gray-600">Change</p>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    ${order.payment.transactionDetails.change?.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            {order.payment.transactionDetails.notes && (
                                                                <div className="text-sm text-gray-600">
                                                                    <p className="font-medium mb-1">Notes:</p>
                                                                    <p className="text-gray-900">
                                                                        {order.payment.transactionDetails.notes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items Section */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                                        <div className="divide-y divide-gray-200">
                                            {order.items?.map((item, index) => (
                                                <div key={index} className="py-3 flex justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.quantity}x {item.menuItem?.name || 'Unknown Item'}
                                                        </p>
                                                        {item.notes && (
                                                            <p className="text-sm text-gray-500">{item.notes}</p>
                                                        )}
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ${((item.menuItem?.price || item.price || 0) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary Section */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Subtotal</p>
                                                <p className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500">Tax</p>
                                                <p className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</p>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                                <p className="text-base font-medium text-gray-900">Total</p>
                                                <p className="text-base font-medium text-orange-600">${order.total.toFixed(2)}</p>
                                            </div>
                                        </div>
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

// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export default function Checkout() {
    const [orders, setOrders] = useState([]);
    const [paidOrders, setPaidOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('unpaid');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllOrders();
                updateOrdersState(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Failed to fetch orders');
            }
        };

        // Initial fetch
        fetchData();

        // Set up polling
        const pollInterval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(pollInterval);
    }, []);

    const updateOrdersState = (allOrders) => {
        const paid = allOrders.filter(order =>
            order.status === 'completed' &&
            order.paymentStatus === 'paid'
        );
        const unpaid = allOrders.filter(order =>
            order.status === 'completed' &&
            order.paymentStatus === 'unpaid'
        );

        setPaidOrders(paid);
        setOrders(unpaid);
        setLoading(false);
    };

    const handleCheckout = (order) => {
        setSelectedOrder(order);
        setShowCheckout(true);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handlePaymentComplete = async () => {
        try {
            const response = await getAllOrders();
            updateOrdersState(response.data.orders);
        } catch (error) {
            console.error('Error updating orders:', error);
            toast.error('Error updating orders after payment');
        }
    };

    const filteredOrders = activeTab === 'unpaid'
        ? orders.filter(order =>
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `Table ${order.table?.number}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.status.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : paidOrders.filter(order =>
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `Table ${order.table?.number}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.status.toLowerCase().includes(searchQuery.toLowerCase())
        );

    if (loading) {
        return (
            <DashboardLayout navigation={navigation}>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />

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
                                    Process payments for orders
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

                {/* Tabs */}
                <div className="mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('unpaid')}
                                className={`${activeTab === 'unpaid'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                            >
                                Unpaid Orders ({orders.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('paid')}
                                className={`${activeTab === 'paid'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                            >
                                Paid Orders ({paidOrders.length})
                            </button>
                        </nav>
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
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    #{order._id.slice(-6)}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <TableCellsIcon className="h-5 w-5 text-blue-600" />
                                                        Table {order.table?.number}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex flex-col">
                                                        <span>{order.items?.length || 0} items</span>
                                                        <span className="text-xs text-gray-400">
                                                            {order.items?.map(item =>
                                                                `${item.quantity}x ${item.menuItem?.name || 'Unknown Item'}`
                                                            ).join(', ') || 'No items'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                    <div className="flex items-center gap-1">
                                                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                                        {order.total.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => handleViewDetails(order)}
                                                            className="inline-flex items-center gap-1"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            View
                                                        </Button>
                                                        {activeTab === 'unpaid' && (
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => handleCheckout(order)}
                                                                disabled={order.payment?.paymentStatus === 'completed'}
                                                                className="inline-flex items-center gap-1"
                                                            >
                                                                <CreditCardIcon className="h-4 w-4" />
                                                                Checkout
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {activeTab === 'unpaid'
                                                                ? 'No unpaid orders available for checkout.'
                                                                : 'No paid orders found.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
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
                        setSelectedOrder(null);
                    }}
                    table={selectedOrder}
                    onPaymentComplete={handlePaymentComplete}
                />

                {/* Order Details Modal */}
                <OrderDetailsModal
                    isOpen={showOrderDetails}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                    order={selectedOrder}
                />
            </div>
        </DashboardLayout>
    );
} 