import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    TableCellsIcon,
    BookOpenIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { getActiveOrders, getAllTables, getAllOrders } from '../../apis/api';
import { toast } from 'react-toastify';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/server', current: true },
    { name: 'Tables & Orders', icon: TableCellsIcon, href: '/server/tables', current: false },
    { name: 'Menu', icon: BookOpenIcon, href: '/server/menu', current: false },
    { name: 'Order History', icon: ClockIcon, href: '/server/history', current: false },
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

export default function ServerInterface() {
    const [initialLoad, setInitialLoad] = useState(true);
    const [stats, setStats] = useState({
        activeTables: 0,
        availableTables: 0,
        totalTables: 0,
        activeOrders: 0,
        completedOrders: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    const fetchServerStats = async () => {
        try {
            const [activeOrdersRes, tablesRes, ordersRes] = await Promise.all([
                getActiveOrders(),
                getAllTables(),
                getAllOrders()
            ]);

            const activeOrders = activeOrdersRes?.data?.orders || [];
            const tables = tablesRes?.data?.tables || [];
            const allOrders = ordersRes?.data?.orders || [];

            // Calculate table stats
            const activeTables = tables.filter(table => table.status === 'occupied').length;
            const availableTables = tables.filter(table => table.status === 'available').length;
            const totalTables = tables.length;

            // Filter today's orders
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysOrders = allOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === today.getTime();
            });

            // Calculate order stats
            const completedOrders = todaysOrders.filter(order => order.status === 'completed').length;

            // Update stats only if there are changes
            setStats(prevStats => {
                const newStats = {
                    activeTables,
                    availableTables,
                    totalTables,
                    activeOrders: activeOrders.length,
                    completedOrders
                };
                return JSON.stringify(newStats) !== JSON.stringify(prevStats) ? newStats : prevStats;
            });

            // Process recent activity
            const allActivity = [
                ...activeOrders.map(order => ({
                    id: order._id,
                    type: 'order',
                    message: `Table ${order.table?.number || 'Unknown'}: ${order.items?.length || 0} items ordered`,
                    status: order.status,
                    timestamp: new Date(order.createdAt),
                    tableNumber: order.table?.number,
                    total: order.total
                })),
                ...todaysOrders
                    .filter(order => order.status === 'completed')
                    .map(order => ({
                        id: `${order._id}-completed`,
                        type: 'completion',
                        message: `Table ${order.table?.number || 'Unknown'}: Order completed`,
                        status: 'completed',
                        timestamp: new Date(order.updatedAt || order.createdAt),
                        tableNumber: order.table?.number,
                        total: order.total
                    })),
                ...todaysOrders
                    .filter(order => order.status === 'cancelled')
                    .map(order => ({
                        id: `${order._id}-cancelled`,
                        type: 'cancellation',
                        message: `Table ${order.table?.number || 'Unknown'}: Order cancelled`,
                        status: 'cancelled',
                        timestamp: new Date(order.updatedAt || order.createdAt),
                        tableNumber: order.table?.number,
                        total: order.total
                    })),
                ...tables
                    .filter(table => table.lastStatusChange)
                    .map(table => ({
                        id: `table-${table._id}`,
                        type: 'table',
                        message: `Table ${table.number || 'Unknown'}: ${table.status.charAt(0).toUpperCase() + table.status.slice(1)}`,
                        status: table.status,
                        timestamp: new Date(table.lastStatusChange),
                        tableNumber: table.number
                    }))
            ];

            // Sort and filter activity
            const sortedActivity = allActivity
                .filter(activity => activity.timestamp && !isNaN(activity.timestamp))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 10);

            // Update activity only if there are changes
            setRecentActivity(prevActivity => {
                return JSON.stringify(sortedActivity) !== JSON.stringify(prevActivity) ? sortedActivity : prevActivity;
            });

        } catch (error) {
            console.error('Error fetching server stats:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            if (initialLoad) {
                setInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        fetchServerStats();
        const interval = setInterval(fetchServerStats, 30000);
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

    return (
        <DashboardLayout navigation={navigation}>
            <div className="min-h-screen">
                <div className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8">
                            <div className="sm:flex sm:items-center text-white">
                                <div className="sm:flex-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                            <HomeIcon className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold">Server Dashboard</h1>
                                            <p className="mt-2 text-lg text-orange-100">
                                                Welcome back! Here's what's happening today.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            {[
                                {
                                    title: "Active Tables",
                                    value: stats.activeTables,
                                    icon: TableCellsIcon,
                                    color: "orange"
                                },
                                {
                                    title: "Active Orders",
                                    value: stats.activeOrders,
                                    icon: BookOpenIcon,
                                    color: "blue"
                                },
                                {
                                    title: "Completed Today",
                                    value: stats.completedOrders,
                                    icon: ClockIcon,
                                    color: "green"
                                },
                                {
                                    title: "Available Tables",
                                    value: stats.availableTables,
                                    total: stats.totalTables,
                                    icon: TableCellsIcon,
                                    color: "gray"
                                }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    layout
                                    initial={false}
                                    className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                                            <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.title}</p>
                                            <h3 className="text-3xl font-semibold text-gray-900">
                                                {stat.value}
                                                {stat.total && <span className="text-sm text-gray-500 ml-1">/ {stat.total}</span>}
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <motion.div
                            layout
                            initial={false}
                            className="bg-white shadow-sm rounded-2xl border border-gray-200"
                        >
                            <div className="p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        <AnimatePresence initial={false}>
                                            {recentActivity.map((activity, activityIdx) => (
                                                <motion.li
                                                    key={activity.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="relative pb-8">
                                                        {activityIdx !== recentActivity.length - 1 && (
                                                            <span
                                                                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        <div className="relative flex items-center space-x-3">
                                                            <div>
                                                                <span className={`h-10 w-10 rounded-full flex items-center justify-center ${activity.type === 'completion' ? 'bg-green-100' :
                                                                    activity.type === 'cancellation' ? 'bg-red-100' :
                                                                        activity.status === 'pending' ? 'bg-yellow-100' :
                                                                            activity.status === 'occupied' ? 'bg-blue-100' :
                                                                                activity.status === 'available' ? 'bg-gray-100' :
                                                                                    'bg-orange-100'
                                                                    }`}>
                                                                    <TableCellsIcon className={`h-6 w-6 ${activity.type === 'completion' ? 'text-green-600' :
                                                                        activity.type === 'cancellation' ? 'text-red-600' :
                                                                            activity.status === 'pending' ? 'text-yellow-600' :
                                                                                activity.status === 'occupied' ? 'text-blue-600' :
                                                                                    activity.status === 'available' ? 'text-gray-600' :
                                                                                        'text-orange-600'
                                                                        }`} />
                                                                </span>
                                                            </div>
                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                                                    {activity.total && (
                                                                        <p className="mt-1 text-sm text-gray-500">
                                                                            Total: ${activity.total.toFixed(2)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                                    <time dateTime={activity.timestamp.toISOString()}>
                                                                        {formatTimeAgo(activity.timestamp)}
                                                                    </time>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                        {recentActivity.length === 0 && (
                                            <motion.li
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="py-4 text-center text-gray-500"
                                            >
                                                No recent activity
                                            </motion.li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 