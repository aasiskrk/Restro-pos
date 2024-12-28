import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    XMarkIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartBarIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    TableCellsIcon,
    CubeIcon,
    Cog6ToothIcon,
    UserGroupIcon,
    EyeIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Input, Button } from '../../components/common/Form';
import { Link } from 'react-router-dom';
import { TableCellsIcon as TableCellsIconSolid } from '@heroicons/react/24/solid';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: true },
    { name: 'Inventory', icon: CubeIcon, href: '/admin/inventory', current: false },
    { name: 'Audit Logs', icon: ClipboardDocumentListIcon, href: '/admin/audit-logs', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
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
    { id: '1234', table: 2, items: 3, amount: 45.00, status: 'in-progress' },
    { id: '1235', table: 3, items: 2, amount: 32.50, status: 'pending' },
];

// Add this mock data for order details
const orderDetails = {
    id: '1234',
    table: 2,
    server: 'John Doe',
    status: 'in-progress',
    time: '2:30 PM',
    items: [
        { id: 1, name: 'Chicken Parmesan', quantity: 2, price: 15.99, notes: 'Extra sauce' },
        { id: 2, name: 'Caesar Salad', quantity: 1, price: 8.99, notes: 'No croutons' },
        { id: 3, name: 'Iced Tea', quantity: 2, price: 2.99 },
    ],
    subtotal: 46.95,
    tax: 3.76,
    total: 50.71
};

function AddTableModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        number: '',
        seats: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log(formData);
        onClose();
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
                        className="fixed inset-y-0 right-0 flex max-w-md w-full z-50"
                    >
                        <div className="relative flex-1 h-full bg-white shadow-xl rounded-l-2xl overflow-hidden">
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">Add New Table</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <Input
                                            label="Table Number"
                                            type="number"
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Number of Seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                                            required
                                        />
                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                        >
                                            Add Table
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

function EditTableModal({ isOpen, onClose, table }) {
    const [formData, setFormData] = useState(table || {
        number: '',
        seats: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log(formData);
        onClose();
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
                        className="fixed inset-y-0 right-0 flex max-w-md w-full z-50"
                    >
                        <div className="relative flex-1 h-full bg-white shadow-xl rounded-l-2xl overflow-hidden">
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">Edit Table</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <Input
                                            label="Table Number"
                                            type="number"
                                            value={formData.number}
                                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Number of Seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                                            required
                                        />
                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                        >
                                            Save Changes
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

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, tableNumber }) {
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
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900">Delete Table</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Are you sure you want to delete Table {tableNumber}? This action cannot be undone.
                                </p>
                                <div className="mt-4 flex justify-center gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={onConfirm}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function ViewOrderModal({ isOpen, onClose, tableId }) {
    const [showAddItems, setShowAddItems] = useState(false);

    // Mock previous orders data
    const previousOrders = [
        {
            id: '1234',
            time: '2:30 PM - Today',
            status: 'Completed',
            items: [
                { name: 'Margherita Pizza', quantity: 1, price: 12.99, notes: 'Extra cheese' },
                { name: 'Caesar Salad', quantity: 1, price: 8.50 }
            ],
            total: 21.49
        },
        {
            id: '1235',
            time: '1:45 PM - Today',
            status: 'Completed',
            items: [
                { name: 'Iced Coffee', quantity: 2, price: 4.99 },
                { name: 'Chocolate Cake', quantity: 1, price: 6.99 }
            ],
            total: 16.97
        }
    ];

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
                                        {previousOrders.map((order) => (
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
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center text-sm"
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
                                                            <span className="text-gray-600">
                                                                ${(item.quantity * item.price).toFixed(2)}
                                                            </span>
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
                                            className="flex items-center gap-2"
                                        >
                                            <PlusIcon className="h-5 w-5" />
                                            Add New Order
                                        </Button>
                                        <div className="flex gap-3">
                                            <Button variant="secondary">
                                                Print History
                                            </Button>
                                            <Button variant="secondary" onClick={onClose}>
                                                Close
                                            </Button>
                                        </div>
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
        { id: 1, name: 'All Items' },
        { id: 2, name: 'Appetizers' },
        { id: 3, name: 'Main Course' },
        { id: 4, name: 'Desserts' },
        { id: 5, name: 'Beverages' }
    ];

    // Mock menu items data
    const menuItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            price: 12.99,
            category: 'Main Course',
            image: 'path_to_image'
        },
        // ... add more items
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
                return newQuantity === 0
                    ? null
                    : { ...item, quantity: newQuantity };
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
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {isAdditionalOrder ? 'Add Items' : 'New Order'}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">Table #{tableId}</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={onClose}
                                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                                        </motion.button>
                                    </div>
                                    <div className="mt-4">
                                        <Input
                                            type="search"
                                            placeholder="Search menu items..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="px-6 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto">
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

                                {/* Menu Items Grid */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {menuItems.map((item) => (
                                            <motion.button
                                                key={item.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleAddToOrder(item)}
                                                className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors"
                                            >
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="mt-1 text-sm text-gray-600">${item.price.toFixed(2)}</div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Current Order */}
                                <div className="border-t border-gray-100">
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
                                                        <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                        >
                                                            <span className="sr-only">Decrease quantity</span>
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </motion.button>
                                                        <span className="text-gray-900 font-medium">{item.quantity}</span>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                        >
                                                            <span className="sr-only">Increase quantity</span>
                                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
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

export default function OrdersAndTables() {
    const [showAddTable, setShowAddTable] = useState(false);
    const [showEditTable, setShowEditTable] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showViewOrder, setShowViewOrder] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTakeOrder, setShowTakeOrder] = useState(false);

    const handleEditClick = (table) => {
        setSelectedTable(table);
        setShowEditTable(true);
    };

    const handleDeleteClick = (table) => {
        setSelectedTable(table);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirm = () => {
        // Handle delete logic here
        console.log('Deleting table:', selectedTable);
        setShowDeleteConfirmation(false);
        setSelectedTable(null);
    };

    const handleViewOrder = (orderId) => {
        setSelectedOrder(orderId);
        setShowViewOrder(true);
    };

    const handleTakeOrder = (tableId) => {
        setSelectedTable(tableId);
        setShowTakeOrder(true);
    };

    const handleTableAction = (table) => {
        setSelectedTable(table.id);
        if (table.status === 'available') {
            setShowTakeOrder(true);
        } else {
            setShowViewOrder(true);
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
                                <h1 className="text-2xl font-semibold text-gray-900">Tables Overview</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Active Tables: <span className="font-medium">{tables.length}</span> •
                                    Active Orders: <span className="font-medium">{activeOrders.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Button onClick={() => setShowAddTable(true)}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Table
                        </Button>
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 text-orange-600 hover:text-orange-900"
                                            onClick={() => handleEditClick(table)}
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteClick(table)}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${table.status === 'available'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}
                                    >
                                        {table.status === 'available' ? 'Available' : 'Occupied'}
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

                {/* Active Orders Section */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h2>
                    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="divide-y divide-gray-200">
                            {activeOrders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 sm:px-6 hover:bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-orange-600 font-medium">#{order.id}</span>
                                                <span className="font-medium">Table {order.table}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {order.items} items • ${order.amount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${order.status === 'in-progress'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {order.status === 'in-progress' ? 'In Progress' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <AddTableModal
                    isOpen={showAddTable}
                    onClose={() => setShowAddTable(false)}
                />
                <EditTableModal
                    isOpen={showEditTable}
                    onClose={() => {
                        setShowEditTable(false);
                        setSelectedTable(null);
                    }}
                    table={selectedTable}
                />
                <DeleteConfirmationModal
                    isOpen={showDeleteConfirmation}
                    onClose={() => {
                        setShowDeleteConfirmation(false);
                        setSelectedTable(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    tableNumber={selectedTable?.number}
                />
                <ViewOrderModal
                    isOpen={showViewOrder}
                    onClose={() => {
                        setShowViewOrder(false);
                        setSelectedOrder(null);
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