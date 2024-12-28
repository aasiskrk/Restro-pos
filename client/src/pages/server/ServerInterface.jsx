import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    TableCellsIcon,
    BookOpenIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/server', current: true },
    { name: 'Tables & Orders', icon: TableCellsIcon, href: '/server/tables', current: false },
    { name: 'Menu', icon: BookOpenIcon, href: '/server/menu', current: false },
    { name: 'Order History', icon: ClockIcon, href: '/server/history', current: false },
];

export default function ServerInterface() {
    return (
        <DashboardLayout navigation={navigation}>
            <div className="min-h-screen bg-gray-50/30">
                <div className="py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold text-gray-900">Server Dashboard</h1>
                            <p className="mt-1 text-sm text-gray-500">Welcome back! Here's an overview of your tasks.</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <TableCellsIcon className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Active Tables</p>
                                        <h3 className="text-xl font-semibold text-gray-900">6</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <BookOpenIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Active Orders</p>
                                        <h3 className="text-xl font-semibold text-gray-900">4</h3>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <ClockIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Orders Completed Today</p>
                                        <h3 className="text-xl font-semibold text-gray-900">12</h3>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    <li className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <TableCellsIcon className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">New order for Table 3</p>
                                                <p className="text-sm text-gray-500">2 minutes ago</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <ClockIcon className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Order #1234 completed</p>
                                                <p className="text-sm text-gray-500">15 minutes ago</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 