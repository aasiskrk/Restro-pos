import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    TableCellsIcon,
    BookOpenIcon,
    ClockIcon,
    UserGroupIcon,
    EyeIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { TableCellsIcon as TableCellsIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Form';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/server', current: false },
    { name: 'Tables & Orders', icon: TableCellsIcon, href: '/server/tables', current: true },
    { name: 'Menu', icon: BookOpenIcon, href: '/server/menu', current: false },
    { name: 'Order History', icon: ClockIcon, href: '/server/history', current: false },
];

// Mock data for tables
const tables = [
    { id: 1, number: 1, seats: 4, status: 'available' },
    { id: 2, number: 2, seats: 6, status: 'occupied' },
    { id: 3, number: 3, seats: 2, status: 'occupied' },
    { id: 4, number: 4, seats: 8, status: 'available' },
];

// Mock data for active orders
const activeOrders = [
    {
        id: '1234',
        table: 2,
        items: [
            { name: 'Grilled Chicken', quantity: 2, status: 'preparing' },
            { name: 'Caesar Salad', quantity: 1, status: 'ready' },
        ],
        status: 'in-progress',
        time: '10 mins ago'
    },
    {
        id: '1235',
        table: 3,
        items: [
            { name: 'Margherita Pizza', quantity: 1, status: 'ready' },
            { name: 'Coke', quantity: 2, status: 'served' },
        ],
        status: 'partially-served',
        time: '15 mins ago'
    }
];

function ViewOrderModal({ isOpen, onClose, tableId }) {
    const [showAddItems, setShowAddItems] = useState(false);
    const [orders, setOrders] = useState([
        {
            id: '1234',
            time: '2:30 PM - Today',
            status: 'In Progress',
            items: [
                { id: 1, name: 'Margherita Pizza', quantity: 1, price: 12.99, notes: 'Extra cheese', status: 'preparing' },
                { id: 2, name: 'Caesar Salad', quantity: 1, price: 8.50, status: 'ready' }
            ],
            total: 21.49
        },
        {
            id: '1235',
            time: '1:45 PM - Today',
            status: 'Completed',
            items: [
                { id: 3, name: 'Iced Coffee', quantity: 2, price: 4.99, status: 'completed' },
                { id: 4, name: 'Chocolate Cake', quantity: 1, price: 6.99, status: 'completed' }
            ],
            total: 16.97
        }
    ]);

    const handleStatusUpdate = (orderId, itemId) => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    const allItemsCompleted = order.items.every(item =>
                        item.id === itemId ? true : item.status === 'completed'
                    );

                    return {
                        ...order,
                        status: allItemsCompleted ? 'Completed' : 'In Progress',
                        items: order.items.map(item =>
                            item.id === itemId ? { ...item, status: 'completed' } : item
                        )
                    };
                }
                return order;
            })
        );
    };

    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'preparing':
                return 'bg-blue-100 text-blue-800';
            case 'ready':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
                                            <h2 className="text-xl font-semibold text-gray-900">Table #{tableId}</h2>
                                            <p className="text-sm text-gray-500 mt-1">Order History</p>
                                        </div>
                                        <button onClick={onClose}>
                                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <motion.div
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-orange-50/50 rounded-xl p-4 border border-orange-100"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-orange-600 font-medium">
                                                                Order #{order.id}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {order.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-3">
                                                    {order.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex justify-between items-center text-sm bg-white rounded-lg p-3 border border-orange-100"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-600">{item.quantity}x</span>
                                                                <span>{item.name}</span>
                                                                {item.notes && (
                                                                    <span className="text-gray-500 italic text-xs">
                                                                        ({item.notes})
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-gray-600">
                                                                    ${(item.quantity * item.price).toFixed(2)}
                                                                </span>
                                                                {item.status !== 'completed' && order.status !== 'Completed' && (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(order.id, item.id)}
                                                                        className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                                                    >
                                                                        Mark as Served
                                                                    </button>
                                                                )}
                                                                {item.status === 'completed' && (
                                                                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                                        Served
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center font-medium">
                                                        <span>Total</span>
                                                        <span>${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                                    <div className="flex justify-between items-center">
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddItems(true)}
                                        >
                                            Add New Items
                                        </Button>
                                        <Button variant="secondary" onClick={onClose}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Add Items Panel */}
            <TakeOrderPanel
                isOpen={showAddItems}
                onClose={() => setShowAddItems(false)}
                tableId={tableId}
                isAdditionalOrder
            />
        </AnimatePresence>
    );
}

function TakeOrderPanel({ isOpen, onClose, tableId, isAdditionalOrder = false }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentOrder, setCurrentOrder] = useState([]);

    // Mock categories data
    const categories = [
        { id: 'all', name: 'All Items' },
        { id: 'appetizers', name: 'Appetizers' },
        { id: 'main', name: 'Main Course' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'beverages', name: 'Beverages' }
    ];

    // Mock menu items data
    const menuItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            price: 12.99,
            category: 'main',
            description: 'Fresh tomatoes, mozzarella, and basil'
        },
        {
            id: 2,
            name: 'Caesar Salad',
            price: 8.99,
            category: 'appetizers',
            description: 'Romaine lettuce, croutons, parmesan'
        },
        // Add more items as needed
    ];

    const handleAddToOrder = (item) => {
        const existingItem = currentOrder.find(orderItem => orderItem.id === item.id);
        if (existingItem) {
            setCurrentOrder(currentOrder.map(orderItem =>
                orderItem.id === item.id
                    ? { ...orderItem, quantity: orderItem.quantity + 1 }
                    : orderItem
            ));
        } else {
            setCurrentOrder([...currentOrder, { ...item, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (itemId, change) => {
        setCurrentOrder(currentOrder.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(0, item.quantity + change);
                return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean));
    };

    const calculateTotal = () => {
        return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

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
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed inset-y-0 right-0 flex max-w-xl w-full z-50"
                    >
                        <div className="relative flex-1 h-full bg-white shadow-xl rounded-l-2xl overflow-hidden">
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {isAdditionalOrder ? 'Add Items' : 'New Order'}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">Table #{tableId}</p>
                                        </div>
                                        <button onClick={onClose}>
                                            <XMarkIcon className="h-6 w-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="px-6 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                                ${selectedCategory === category.id
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {menuItems
                                            .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                                            .map((item) => (
                                                <motion.button
                                                    key={item.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAddToOrder(item)}
                                                    className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 transition-colors"
                                                >
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="mt-1 text-sm text-gray-500">{item.description}</div>
                                                    <div className="mt-2 text-sm font-medium text-orange-600">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </motion.button>
                                            ))}
                                    </div>
                                </div>

                                {/* Current Order */}
                                <div className="border-t border-gray-200">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Current Order</h3>
                                            <span className="text-sm text-gray-500">
                                                {currentOrder.length} items
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {currentOrder.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                        >
                                                            <span className="sr-only">Decrease quantity</span>
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="text-gray-900 font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                        >
                                                            <span className="sr-only">Increase quantity</span>
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-500">Total</span>
                                        <span className="text-lg font-semibold text-gray-900">
                                            ${calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                // Handle order submission
                                                console.log('Submitting order:', currentOrder);
                                                onClose();
                                            }}
                                        >
                                            Place Order
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

export default function TablesAndOrders() {
    const [showViewOrder, setShowViewOrder] = useState(false);
    const [showTakeOrder, setShowTakeOrder] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const handleTableAction = (table) => {
        setSelectedTable(table.id);
        if (table.status === 'available') {
            setShowTakeOrder(true);
        } else {
            setShowViewOrder(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';

            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getOrderStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'preparing':
                return 'bg-yellow-100 text-yellow-800';
            case 'served':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <TableCellsIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Tables & Orders</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Active Tables: <span className="font-medium">{tables.length}</span> •
                                    Active Orders: <span className="font-medium">{activeOrders.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tables.map((table) => (
                            <motion.div
                                key={table.id}
                                layout
                                className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">Table {table.number}</h3>
                                        <div className="flex items-center mt-2">
                                            <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">{table.seats} Seats</span>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(table.status)}`}>
                                        {table.status}
                                    </span>
                                </div>
                                <Button
                                    variant={table.status === 'available' ? 'primary' : 'secondary'}
                                    className="w-full mt-4"
                                    onClick={() => handleTableAction(table)}
                                >
                                    {table.status === 'available' ? 'Take Order' : 'View Orders'}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Active Orders */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Active Orders</h2>
                    <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-gray-200">
                        <ul role="list" className="divide-y divide-gray-200">
                            {activeOrders.map((order) => (
                                <li key={order.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                                                <span className="text-sm text-gray-500">• Table {order.table}</span>
                                                <span className="text-sm text-gray-500">• {order.time}</span>
                                            </div>
                                            <ul className="mt-2 space-y-1">
                                                {order.items.map((item, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">{item.quantity}x {item.name}</span>
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getOrderStatusColor(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Modals */}
                <ViewOrderModal
                    isOpen={showViewOrder}
                    onClose={() => {
                        setShowViewOrder(false);
                        setSelectedTable(null);
                    }}
                    tableId={selectedTable}
                />
                <TakeOrderPanel
                    isOpen={showTakeOrder}
                    onClose={() => {
                        setShowTakeOrder(false);
                        setSelectedTable(null);
                    }}
                    tableId={selectedTable}
                />
            </div>
        </DashboardLayout>
    );
}
