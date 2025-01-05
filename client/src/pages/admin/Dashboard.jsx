import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    TableCellsIcon,
    CubeIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { ChartBarIcon as ChartBarIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: true },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

const statsCards = [
    {
        title: "Today's Sales",
        value: "$2,854.90",
        change: "+12.5% from yesterday",
        changeType: "positive",
        icon: CurrencyDollarIcon,
    },
    {
        title: "Active Orders",
        value: "24",
        subtext: "4 pending delivery",
        icon: ClipboardDocumentListIcon,
    },
    {
        title: "Staff Present",
        value: "18/22",
        subtext: "4 on leave today",
        icon: UsersIcon,
    },
    {
        title: "Low Stock Items",
        value: "8",
        subtext: "Requires attention",
        changeType: "warning",
        icon: ExclamationTriangleIcon,
    },
];

const popularItems = [
    { name: 'Classic Burger', orders: 142, icon: '🍔' },
    { name: 'Pepperoni Pizza', orders: 98, icon: '🍕' },
    { name: 'Caesar Salad', orders: 85, icon: '🥗' },
];

const recentOrders = [
    { id: '124', table: 'Table 7', items: 3, amount: '$45.90', status: 'In Progress' },
    { id: '123', table: 'Table 12', items: 5, amount: '$78.50', status: 'Completed' },
];

const staffPerformance = [
    { name: 'Sarah Johnson', avatar: 'SJ', performance: 98 },
    { name: 'Mike Chen', avatar: 'MC', performance: 95 },
];

export default function Dashboard() {
    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ChartBarIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Welcome back! Here's what's happening today.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                                    {stat.change && (
                                        <p className={`mt-2 text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-500'}`}>
                                            {stat.change}
                                        </p>
                                    )}
                                    {stat.subtext && (
                                        <p className="mt-2 text-sm text-gray-500">{stat.subtext}</p>
                                    )}
                                </div>
                                <div className={`rounded-lg p-3 ${stat.changeType === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100'}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Sales Overview */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
                        {/* Add your chart component here */}
                        <div className="h-80 mt-4">
                            {/* Placeholder for chart */}
                            <div className="h-full w-full bg-gray-50 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Popular Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Popular Items</h3>
                        <div className="mt-4 space-y-4">
                            {popularItems.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.orders} orders today</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                        <div className="mt-4 space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-600 font-medium">#{order.id}</span>
                                            <span className="font-medium">{order.table}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{order.items} items • {order.amount}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Staff Performance */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Staff Performance</h3>
                        <div className="mt-4 space-y-4">
                            {staffPerformance.map((staff) => (
                                <div key={staff.name} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <span className="text-sm font-medium text-orange-600">{staff.avatar}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{staff.name}</p>
                                        <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                                            <div
                                                className="h-2 rounded-full bg-orange-500"
                                                style={{ width: `${staff.performance}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{staff.performance}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 