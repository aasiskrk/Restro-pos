import { useState, useEffect } from 'react';
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
import { getAllPayments, getAllOrders } from '../../apis/api';
import { toast } from 'react-hot-toast';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier', current: true },
    { name: 'Checkout', icon: CreditCardIcon, href: '/cashier/checkout', current: false },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history', current: false },
];

const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / 1000 / 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function CashierInterface() {
    const [initialLoad, setInitialLoad] = useState(true);
    const [stats, setStats] = useState({
        totalSalesToday: 0,
        pendingPayments: 0,
        averageOrderValue: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState([]);

    const fetchCashierStats = async () => {
        try {
            const [paymentsResponse, ordersResponse] = await Promise.all([
                getAllPayments(),
                getAllOrders()
            ]);

            const payments = paymentsResponse?.payments || [];
            const orders = ordersResponse?.data?.orders || [];

            // Filter today's payments
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysPayments = payments.filter(payment => {
                const paymentDate = new Date(payment.createdAt);
                paymentDate.setHours(0, 0, 0, 0);
                return paymentDate.getTime() === today.getTime();
            });

            // Calculate stats
            const totalSalesToday = todaysPayments
                .filter(payment => payment.paymentStatus === 'completed')
                .reduce((sum, payment) => sum + payment.amount, 0);

            // Get pending payments (completed orders but unpaid)
            const pendingPayments = orders.filter(order =>
                order.status === 'completed' &&
                order.paymentStatus === 'unpaid'
            ).length;

            const completedPayments = todaysPayments.filter(payment => payment.paymentStatus === 'completed');
            const averageOrderValue = completedPayments.length > 0
                ? completedPayments.reduce((sum, payment) => sum + payment.amount, 0) / completedPayments.length
                : 0;

            // Update stats
            setStats(prevStats => {
                const newStats = {
                    totalSalesToday,
                    pendingPayments,
                    averageOrderValue,
                };
                return JSON.stringify(newStats) !== JSON.stringify(prevStats) ? newStats : prevStats;
            });

            // Get recent transactions (last 5 completed or pending payments)
            const recentPayments = payments
                .filter(payment => ['completed', 'pending'].includes(payment.paymentStatus))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(payment => ({
                    id: payment._id,
                    orderId: payment.orderId?._id,
                    amount: payment.amount,
                    time: payment.createdAt,
                    status: payment.paymentStatus,
                    paymentMethod: payment.paymentMethod,
                }));

            // Update recent transactions
            setRecentTransactions(prevTransactions => {
                return JSON.stringify(recentPayments) !== JSON.stringify(prevTransactions)
                    ? recentPayments
                    : prevTransactions;
            });

        } catch (error) {
            console.error('Error fetching cashier stats:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            if (initialLoad) {
                setInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        fetchCashierStats();
        const interval = setInterval(fetchCashierStats, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    if (initialLoad) {
        return (
            <DashboardLayout navigation={navigation}>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
                </div>
            </DashboardLayout>
        );
    }

    const quickStats = [
        {
            name: 'Total Sales Today',
            value: `$${stats.totalSalesToday.toFixed(2)}`,
            icon: CurrencyDollarIcon,
            change: 'Today',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            name: 'Pending Payments',
            value: stats.pendingPayments.toString(),
            icon: TableCellsIcon,
            change: 'Active',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
        },
        {
            name: 'Average Order Value',
            value: `$${stats.averageOrderValue.toFixed(2)}`,
            icon: ChartBarIcon,
            change: 'Per order',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

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
                                                    <span className="text-sm text-gray-500">
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
                                                    <div className={`p-2 rounded-full ${transaction.paymentMethod === 'qr'
                                                        ? 'bg-blue-100'
                                                        : 'bg-green-100'
                                                        }`}>
                                                        {transaction.paymentMethod === 'qr' ? (
                                                            <CreditCardIcon className="h-5 w-5 text-blue-600" />
                                                        ) : (
                                                            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                Order #{transaction.orderId?.slice(-6)}
                                                            </p>
                                                            <span className="text-sm text-gray-500">
                                                                • {formatTimeAgo(transaction.time)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {transaction.paymentMethod.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ${transaction.amount.toFixed(2)}
                                                    </p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {transaction.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <li className="p-4 text-center text-gray-500">
                                            No recent transactions
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 