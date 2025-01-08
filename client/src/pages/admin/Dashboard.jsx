import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    TableCellsIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { getDashboardStats } from '../../apis/api';
import { toast } from 'react-toastify';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: true },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('today');
    const [dashboardData, setDashboardData] = useState({
        stats: {
            todaysSales: 0,
            salesChange: 0,
            activeOrders: 0,
            pendingDelivery: 0,
            staffPresent: 0,
            staffAbsent: 0,
            staffNoRecord: 0,
            totalStaff: 0,
            lowStockItems: 0
        },
        popularItems: [],
        recentOrders: [],
        salesOverview: []
    });

    const fetchDashboardData = async () => {
        try {
            const response = await getDashboardStats(timeRange);
            if (response.data && response.data.data) {
                setDashboardData(response.data.data);

            }
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Refresh data every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        console.log("Updated Dashboard Data (Frontend):", dashboardData);

        return () => clearInterval(interval);
    }, [timeRange]);

    const getStatsCards = () => [
        {
            title: "Today's Sales",
            value: `$${(dashboardData.stats.todaysSales || 0).toFixed(2)}`,
            change: `${dashboardData.stats.salesChange > 0 ? '+' : ''}${(dashboardData.stats.salesChange || 0).toFixed(1)}% from yesterday`,
            changeType: (dashboardData.stats.salesChange || 0) >= 0 ? "positive" : "negative",
            icon: CurrencyDollarIcon,
        },
        {
            title: "Active Orders",
            value: String(dashboardData.stats.activeOrders || 0),
            subtext: `${dashboardData.stats.pendingDelivery || 0} pending delivery`,
            icon: ClipboardDocumentListIcon,
            onClick: () => navigate('/admin/orders'),
            cursor: 'cursor-pointer'
        },
        {
            title: "Staff Present",
            value: `${dashboardData.stats.staffPresent || 0}/${dashboardData.stats.totalStaff || 0}`,
            subtext: dashboardData.stats.staffAbsent > 0
                ? `${dashboardData.stats.staffAbsent} marked absent`
                : dashboardData.stats.staffNoRecord > 0
                    ? `${dashboardData.stats.staffNoRecord} not marked yet`
                    : 'All staff accounted for 🫡',
            icon: UsersIcon,
            onClick: () => navigate('/admin/staff?tab=attendance'),
            cursor: 'cursor-pointer'
        },
        {
            title: "Low Stock Items",
            value: String(dashboardData.stats.lowStockItems || 0),
            subtext: "Requires attention",
            changeType: "warning",
            icon: ExclamationTriangleIcon,
            onClick: () => {
                // Trigger notification panel open
                document.dispatchEvent(new CustomEvent('openNotifications'));
            },
            cursor: 'cursor-pointer'
        },
    ];

    // Prepare chart data
    const getChartData = () => {
        const salesData = dashboardData.salesOverview || [];
        console.log('Sales data for chart:', salesData);

        if (!salesData || salesData.length === 0) {
            return {
                labels: [],
                datasets: [{
                    label: 'Sales',
                    data: [],
                    fill: false,
                    borderColor: 'rgb(249, 115, 22)',
                    backgroundColor: 'rgba(249, 115, 22, 0.5)',
                    tension: 0.4
                }]
            };
        }

        return {
            labels: salesData.map(item => item.date),
            datasets: [
                {
                    label: 'Sales',
                    data: salesData.map(item => item.total),
                    fill: false,
                    borderColor: 'rgb(249, 115, 22)',
                    backgroundColor: 'rgba(249, 115, 22, 0.5)',
                    tension: 0.4
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => `$${context.raw.toFixed(2)}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    callback: value => `$${value.toFixed(2)}`
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    if (loading) {
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
            <div className="min-h-screen bg-gray-50">
                <div className="px-6 lg:px-8 py-8 max-w-[2000px] mx-auto">
                    {/* Header Section with gradient background */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8">
                        <div className="sm:flex sm:items-center text-white">
                            <div className="sm:flex-auto">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                                        <ChartBarIconSolid className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">Dashboard</h1>
                                        <p className="mt-2 text-lg text-orange-100">
                                            Welcome back! Here's what's happening today.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid with larger cards */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        {getStatsCards().map((stat) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                onClick={stat.onClick}
                                className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 ${stat.onClick ? 'hover:scale-105 ' + stat.cursor : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-gray-600">{stat.title}</p>
                                        <p className="mt-3 text-4xl font-bold text-gray-900">{stat.value}</p>
                                        {stat.change && (
                                            <p className={`mt-3 text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.change}
                                            </p>
                                        )}
                                        {stat.subtext && (
                                            <p className="mt-2 text-sm text-gray-500">{stat.subtext}</p>
                                        )}
                                    </div>
                                    <div className={`rounded-xl p-4 ${stat.changeType === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100'}`}>
                                        <stat.icon className="h-8 w-8" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content Grid with better spacing */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Sales Overview */}
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Sales Overview
                                    {timeRange === 'today' && ' (Hourly)'}
                                    {timeRange === 'week' && ' (Last 7 Days)'}
                                    {timeRange === 'month' && ' (This Month)'}
                                </h3>
                                <select
                                    value={timeRange}
                                    onChange={(e) => {
                                        setTimeRange(e.target.value);
                                        setLoading(true);
                                    }}
                                    className="rounded-xl border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500 py-2 px-4"
                                >
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                            <div className="mt-6" style={{ height: "400px" }}>
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
                                    </div>
                                ) : dashboardData.salesOverview && dashboardData.salesOverview.length > 0 ? (
                                    <Line data={getChartData()} options={chartOptions} height={400} />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">No sales data available for {timeRange}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Popular Items with enhanced styling */}
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Items</h3>
                            <div className="mt-6 space-y-6">
                                {(dashboardData.popularItems || []).map((item) => (
                                    <div key={item.name} className="flex items-center justify-between hover:bg-orange-50 p-4 rounded-xl transition-colors duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                                <ClipboardDocumentListIcon className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">{item.orders} orders today</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(dashboardData.popularItems || []).length === 0 && (
                                    <div className="flex items-center justify-center h-[300px]">
                                        <p className="text-gray-500">No popular items today</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Orders with enhanced styling */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(dashboardData.recentOrders || []).map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 hover:bg-orange-50 rounded-xl transition-colors duration-200">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-orange-600 font-bold">#{order._id.slice(-4)}</span>
                                                <span className="font-semibold text-gray-900">Table {order.table?.number}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{order.items.length} items • ${order.total.toFixed(2)}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                                {(dashboardData.recentOrders || []).length === 0 && (
                                    <div className="col-span-2 flex items-center justify-center h-[200px]">
                                        <p className="text-gray-500">No recent orders</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 