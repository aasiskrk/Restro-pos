import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    TableCellsIcon,
    BookOpenIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/server', current: false },
    { name: 'Tables & Orders', icon: TableCellsIcon, href: '/server/tables', current: false },
    { name: 'Menu', icon: BookOpenIcon, href: '/server/menu', current: false },
    { name: 'Order History', icon: ClockIcon, href: '/server/history', current: true },
];

// Mock order history data
const orderHistory = [
    {
        id: 'ORD-2025001',
        date: 'Jan 15, 2025 14:30',
        table: 'Table 2',
        server: 'Sarah Johnson',
        items: [
            { name: 'Classic Burger', quantity: 2, price: 12.99 },
            { name: 'Caesar Salad', quantity: 1, price: 9.99 },
            { name: 'Iced Coffee', quantity: 2, price: 4.99 }
        ],
        total: 84.50,
        status: 'Completed'
    },
    {
        id: 'ORD-2025002',
        date: 'Jan 15, 2025 15:45',
        table: 'Table 1',
        server: 'Mike doe',
        items: [
            { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
            { name: 'Chocolate Lava Cake', quantity: 1, price: 7.99 }
        ],
        total: 21.00,
        status: 'Completed'
    },
    {
        id: 'ORD-2025003',
        date: 'Jan 15, 2025 16:20',
        table: 'Table 1',
        server: 'Mike doe',
        items: [
            { name: 'Caesar Salad', quantity: 1, price: 9.99 },
            { name: 'Iced Coffee', quantity: 2, price: 4.99 }
        ],
        total: 21.00,
        status: 'In Progress'
    }
];

function OrderDetailsModal({ isOpen, onClose, order }) {
    if (!order) return null;

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
                            <div className="flex flex-col max-h-[90vh]">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                                            <p className="mt-1 text-sm text-gray-500">Order #{order.id}</p>
                                        </div>
                                        <button onClick={onClose}>
                                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-6">
                                        {/* Order Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Date & Time</p>
                                                <p className="font-medium">{order.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Table</p>
                                                <p className="font-medium">{order.table}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Server</p>
                                                <p className="font-medium">{order.server}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Status</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="space-y-4">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {item.quantity}x {item.name}
                                                                </p>
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
                                                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                                                    <p className="font-medium text-gray-900">Total</p>
                                                    <p className="text-lg font-semibold text-orange-600">
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                </div>
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

export default function OrderHistory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const filteredOrders = orderHistory.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.server.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

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
                                <h1 className="text-2xl font-semibold text-gray-900">Orders History</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    View and manage your past orders
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16">
                        <div className="relative">
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
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{order.id}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.table}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.server}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.items.length} items</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="bg-white px-4 py-3 sm:px-6">
                                    <div className="text-sm text-gray-700">
                                        Showing {filteredOrders.length} of {orderHistory.length} orders
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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