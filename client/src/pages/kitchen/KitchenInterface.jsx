import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TableCellsIcon,
    BellAlertIcon,
    ClockIcon,
    UserGroupIcon,
    BellIcon,
    XMarkIcon,
    EyeIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { TableCellsIcon as TableCellsIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Button } from '../../components/common/Form';

const navigation = [
    { name: 'Kitchen Display', icon: TableCellsIcon, href: '/kitchen', current: true },
    { name: 'Inventory Alert', icon: BellAlertIcon, href: '/kitchen/inventory', current: false },
];

// Mock data for orders with more items to demonstrate scrolling
const orders = [
    {
        id: '1234',
        table: 12,
        items: [
            { name: 'Grilled Salmon', quantity: 2, status: 'new' },
            { name: 'Caesar Salad', quantity: 1, status: 'new' },
            { name: 'Steak Medium', quantity: 1, status: 'new' },
            { name: 'French Fries', quantity: 2, status: 'new' },
            { name: 'Garlic Bread', quantity: 1, status: 'new' }
        ],
        time: '7 items',
        status: 'new'
    },
    {
        id: '1235',
        table: 8,
        items: [
            { name: 'Pasta Carbonara', quantity: 2, status: 'in-progress' },
            { name: 'Mushroom Soup', quantity: 1, status: 'in-progress' },
            { name: 'Bruschetta', quantity: 1, status: 'in-progress' }
        ],
        time: '4 items',
        status: 'in-progress'
    },
    {
        id: '1236',
        table: 15,
        items: [
            { name: 'Fish & Chips', quantity: 1, status: 'ready' },
            { name: 'Burger', quantity: 1, status: 'ready' }
        ],
        time: '2 items',
        status: 'ready'
    }
];

export default function KitchenInterface() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const totalOrders = orders.length;
    const newOrders = orders.filter(order => order.status === 'new').length;
    const inProgressOrders = orders.filter(order => order.status === 'in-progress').length;
    const readyOrders = orders.filter(order => order.status === 'ready').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'new':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'in-progress':
                return 'bg-orange-50 text-orange-700 border border-orange-200';
            case 'ready':
                return 'bg-green-50 text-green-700 border border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border border-gray-200';
        }
    };

    const getStatusBorderColor = (status) => {
        switch (status) {
            case 'new':
                return 'border-blue-100 bg-blue-50/30';
            case 'in-progress':
                return 'border-orange-100 bg-orange-50/30';
            case 'ready':
                return 'border-green-100 bg-green-50/30';
            default:
                return 'border-gray-100';
        }
    };

    const getActionButtonStyle = (status) => {
        switch (status) {
            case 'new':
                return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 border-orange-500';
            case 'in-progress':
                return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 border-green-500';
            case 'ready':
                return 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400 border-orange-400';
            default:
                return 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400 border-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'new':
                return <SparklesIcon className="h-4 w-4" />;
            case 'in-progress':
                return <ArrowPathIcon className="h-4 w-4" />;
            case 'ready':
                return <CheckCircleIcon className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const filteredOrders = selectedFilter === 'all'
        ? orders
        : orders.filter(order => order.status === selectedFilter);

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <TableCellsIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Kitchen Display</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Manage incoming orders and their status
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            <BellIcon className="h-5 w-5" />
                            Call Server
                        </Button>
                    </div>
                </div>

                {/* Status Filters */}
                <div className="mt-8 flex flex-wrap gap-4">
                    <button
                        onClick={() => setSelectedFilter('all')}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedFilter === 'all'
                            ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500 border border-gray-300'
                            }`}
                    >
                        All Orders
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                            }`}>
                            {totalOrders}
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedFilter('new')}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedFilter === 'new'
                            ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500 border border-gray-300'
                            }`}
                    >
                        New
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedFilter === 'new' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                            }`}>
                            {newOrders}
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedFilter('in-progress')}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedFilter === 'in-progress'
                            ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500 border border-gray-300'
                            }`}
                    >
                        In Progress
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedFilter === 'in-progress' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                            }`}>
                            {inProgressOrders}
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedFilter('ready')}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedFilter === 'ready'
                            ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500 border border-gray-300'
                            }`}
                    >
                        Ready
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedFilter === 'ready' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                            }`}>
                            {readyOrders}
                        </span>
                    </button>
                </div>

                {/* Orders Grid */}
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            layout
                            className={`bg-white rounded-xl shadow-sm border-2 ${getStatusBorderColor(order.status)} overflow-hidden flex flex-col`}
                            style={{ height: '250px' }}
                        >
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-orange-50 border border-orange-100`}>
                                            <TableCellsIcon className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Table {order.table}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-1 rounded-full hover:bg-orange-50"
                                            title="View Details"
                                        >
                                            <EyeIcon className="h-5 w-5 text-orange-500" />
                                        </button>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status === 'in-progress' ? 'In Progress' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 border border-orange-100 text-sm font-medium text-orange-700">{item.quantity}x</span>
                                                <span className="text-sm text-gray-600">{item.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    {order.status === 'new' && (
                                        <button
                                            className={`w-full px-4 py-2 border text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${getActionButtonStyle(order.status)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <SparklesIcon className="h-4 w-4" />
                                                <span>Start Order</span>
                                            </div>
                                        </button>
                                    )}
                                    {order.status === 'in-progress' && (
                                        <button
                                            className={`w-full px-4 py-2 border text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${getActionButtonStyle(order.status)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircleIcon className="h-4 w-4" />
                                                <span>Mark Ready</span>
                                            </div>
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button
                                            className={`w-full px-4 py-2 border text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${getActionButtonStyle(order.status)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <BellIcon className="h-4 w-4" />
                                                <span>Call Server</span>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Order Details Modal */}
                <AnimatePresence>
                    {selectedOrder && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center"
                            onClick={() => setSelectedOrder(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className={`bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-hidden border-t-4 ${getStatusBorderColor(selectedOrder.status)}`}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-50 border border-orange-100">
                                            <TableCellsIcon className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-xl font-semibold text-gray-900">Table {selectedOrder.table}</h2>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                                    {getStatusIcon(selectedOrder.status)}
                                                    {selectedOrder.status === 'in-progress' ? 'In Progress' : selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">Order #{selectedOrder.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-2 rounded-full hover:bg-orange-50"
                                    >
                                        <XMarkIcon className="h-6 w-6 text-orange-500" />
                                    </button>
                                </div>
                                <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                                            <div className="space-y-4">
                                                {selectedOrder.items.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between py-2 border-b border-orange-100">
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 border border-orange-100 text-orange-700 font-medium">
                                                                {item.quantity}x
                                                            </span>
                                                            <span className="text-gray-900">{item.name}</span>
                                                        </div>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                            {getStatusIcon(item.status)}
                                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex justify-end gap-4">
                                        {selectedOrder.status === 'new' && (
                                            <button
                                                className={`px-4 py-2 border text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${getActionButtonStyle(selectedOrder.status)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <SparklesIcon className="h-4 w-4" />
                                                    <span>Start Order</span>
                                                </div>
                                            </button>
                                        )}
                                        {selectedOrder.status === 'in-progress' && (
                                            <button
                                                className={`px-4 py-2 border text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${getActionButtonStyle(selectedOrder.status)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    <span>Mark Ready</span>
                                                </div>
                                            </button>
                                        )}
                                        {selectedOrder.status === 'ready' && (
                                            <button
                                                className={`px-4 py-2 border text-sm font-medium rounded-md text-white shadow-sm transition-colors duration-200 ${getActionButtonStyle(selectedOrder.status)} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <BellIcon className="h-4 w-4" />
                                                    <span>Call Server</span>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
} 