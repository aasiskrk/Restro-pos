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
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Input, Button } from '../../components/common/Form';
import { Link } from 'react-router-dom';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: true },
    { name: 'Inventory', icon: CubeIcon, href: '/admin/inventory', current: false },
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
        // Handle table addition logic here
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                    >
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Add New Table</h2>
                                <button onClick={onClose}>
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="secondary" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Add Table
                                    </Button>
                                </div>
                            </form>
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                    >
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900">Delete Table</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Are you sure you want to delete Table {tableNumber}? This action cannot be undone.
                                </p>
                                <div className="mt-6 flex justify-end gap-3">
                                    <Button variant="secondary" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={onConfirm}>
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

function EditTableModal({ isOpen, onClose, table }) {
    const [formData, setFormData] = useState({
        number: table?.number || '',
        seats: table?.seats || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle table edit logic here
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                    >
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Edit Table {table?.number}</h2>
                                <button onClick={onClose}>
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button variant="secondary" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function ViewOrderModal({ isOpen, onClose, orderId }) {
    const order = orderDetails; // In real app, fetch order details based on orderId

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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
                    >
                        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="h-4 w-4" />
                                            {order.time}
                                        </span>
                                        <span>Table {order.table}</span>
                                        <span>Server: {order.server}</span>
                                    </div>
                                </div>
                                <button onClick={onClose}>
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Order Items */}
                            <div className="mt-6">
                                <div className="flow-root">
                                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Item</th>
                                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Qty</th>
                                                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
                                                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {order.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="whitespace-nowrap px-3 py-4">
                                                                <div>
                                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                                    {item.notes && (
                                                                        <div className="text-sm text-gray-500">{item.notes}</div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-gray-500">{item.quantity}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-right text-gray-500">
                                                                ${item.price.toFixed(2)}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-right text-gray-900">
                                                                ${(item.quantity * item.price).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th colSpan="3" className="px-3 py-3.5 text-right text-sm font-normal text-gray-500">Subtotal</th>
                                                        <td className="whitespace-nowrap px-3 py-3.5 text-right text-gray-900">${order.subtotal.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3" className="px-3 py-3.5 text-right text-sm font-normal text-gray-500">Tax</th>
                                                        <td className="whitespace-nowrap px-3 py-3.5 text-right text-gray-900">${order.tax.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Total</th>
                                                        <td className="whitespace-nowrap px-3 py-3.5 text-right text-gray-900 font-semibold">${order.total.toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="secondary" onClick={onClose}>
                                    Close
                                </Button>
                                <Button>
                                    Print Order
                                </Button>
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

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="sm:flex sm:items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Tables Overview</h1>
                    <Button onClick={() => setShowAddTable(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Table
                    </Button>
                </div>

                {/* Tables Grid */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                        className="p-1 text-gray-400 hover:text-orange-500"
                                        onClick={() => handleEditClick(table)}
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-1 text-gray-400 hover:text-red-500"
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
                            <Link
                                to={table.status === 'available' ? `/admin/orders/new/${table.id}` : `/admin/orders/view/${table.currentOrder}`}
                            >
                                <Button
                                    variant={table.status === 'available' ? 'primary' : 'secondary'}
                                    className="w-full mt-4"
                                    disabled={table.status !== 'available'}
                                >
                                    {table.status === 'available' ? 'Take Order' : 'View Order'}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Active Orders Section */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Orders</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flow-root">
                            <div className="divide-y divide-gray-200">
                                {activeOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 sm:px-6"
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
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleViewOrder(order.id)}
                                                    className="text-gray-400 hover:text-orange-500"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Table Modal */}
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
                    orderId={selectedOrder}
                />
            </div>
        </DashboardLayout>
    );
} 