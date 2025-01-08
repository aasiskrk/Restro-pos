import { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Input, Select, Button } from '../../components/common/Form';
import { TableCellsIcon as TableCellsIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import {
    createTable,
    getAllTables,
    updateTable,
    deleteTable,
    updateTableStatus,
    createOrder,
    getActiveOrders,
    getOrdersByTable,
    updateOrderStatus,
    addItemsToOrder,
    getAllMenuItems,
    getAllCategories,
    updateOrder,
    getAllOrders,
} from '../../apis/api';
import { showToast, handleApiError } from '../../utils/toast';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: true },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

function AddTableModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        number: '',
        seats: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            setFormData({ number: '', seats: '' }); // Reset form
        } catch (error) {
            console.error('Error submitting form:', error);
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
                                            onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                                            required
                                            min="1"
                                        />
                                        <Input
                                            label="Number of Seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                                            required
                                            min="1"
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

function EditTableModal({ isOpen, onClose, onSubmit, table }) {
    const [formData, setFormData] = useState({
        number: '',
        seats: ''
    });

    useEffect(() => {
        if (table) {
            setFormData({
                number: table.number,
                seats: table.seats
            });
        }
    }, [table]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(table._id, formData);
        } catch (error) {
            console.error('Error updating table:', error);
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
                                            onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                                            required
                                            min="1"
                                        />
                                        <Input
                                            label="Number of Seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                                            required
                                            min="1"
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

function ViewOrderModal({ isOpen, onClose, tableId, tableNumber, orders, onUpdateStatus, onAddItems, onUpdateOrder }) {
    const [showAddItems, setShowAddItems] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setShowAddItems(true);
    };

    const handleOrderSubmit = async (data) => {
        try {
            if (editingOrder) {
                await onUpdateOrder(editingOrder._id, {
                    items: data.items,
                    subtotal: data.subtotal,
                    tax: data.tax,
                    total: data.total
                });
            } else {
                // Format data exactly like TakeOrder
                const orderData = {
                    tableId: {
                        tableId: tableId
                    },
                    items: data.items.map(item => ({
                        menuItemId: item._id,
                        quantity: item.quantity,
                        notes: item.notes || ''
                    })),
                    subtotal: data.subtotal,
                    tax: data.tax,
                    total: data.total
                };

                console.log('Submitting order data:', orderData);
                await onAddItems(orderData);
            }
            setShowAddItems(false);
            setEditingOrder(null);
        } catch (error) {
            console.error('Error processing order:', error);
            toast.error('Failed to process order');
        }
    };

    // Filter to show only active orders in the modal
    const activeOrders = orders ? orders.filter(order =>
        ['pending', 'in-progress'].includes(order.status)
    ) : [];

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
                        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
                            <div className="flex flex-col max-h-[90vh]">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Table #{tableNumber}</h2>
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
                                        {activeOrders.map((order) => (
                                            <motion.div
                                                key={order._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-orange-50/50 rounded-xl p-4 border border-orange-100"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-orange-600 font-medium">
                                                                Order #{order._id.slice(-6)}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(order.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                        {order.status === 'pending' && (
                                                            <Select
                                                                value={order.status}
                                                                onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                                                                className="text-sm"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="in-progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </Select>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    {order.items.map((item, index) => (
                                                        <div
                                                            key={`${order._id}-${index}`}
                                                            className="flex justify-between items-center text-sm"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-600">{item.quantity}x</span>
                                                                <span>{item.menuItem.name}</span>
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
                                                    <div className="border-t border-gray-200 mt-3 pt-3">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-600">Subtotal</span>
                                                            <span>${order.subtotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm mt-1">
                                                            <span className="text-gray-600">Tax</span>
                                                            <span>${order.tax.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center font-medium mt-2">
                                                            <span>Total</span>
                                                            <span>${order.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    {order.status === 'pending' && (
                                                        <div className="mt-4 flex gap-2">
                                                            <Button
                                                                variant="secondary"
                                                                onClick={() => handleEditOrder(order)}
                                                                className="text-sm"
                                                            >
                                                                Edit Order
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {activeOrders.length === 0 && (
                                            <div className="text-center text-gray-500">
                                                No active orders for this table
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                                    <div className="flex justify-end">
                                        <Button variant="secondary" onClick={onClose}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Add Items Panel */}
            <TakeOrderPanel
                isOpen={showAddItems}
                onClose={() => {
                    setShowAddItems(false);
                    setEditingOrder(null);
                }}
                tableId={tableId}
                tableNumber={tableNumber}
                onSubmit={handleOrderSubmit}
                existingOrder={editingOrder}
            />
        </AnimatePresence>
    );
}

function TakeOrderPanel({ isOpen, onClose, tableId, tableNumber, onSubmit, existingOrder = null }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentOrder, setCurrentOrder] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Initialize current order if editing
        if (existingOrder) {
            const orderItems = existingOrder.items.map(item => ({
                _id: item.menuItem._id,
                name: item.menuItem.name,
                price: item.price,
                quantity: item.quantity,
                notes: item.notes || ''
            }));
            setCurrentOrder(orderItems);
        }
    }, [existingOrder]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [menuItemsRes, categoriesRes] = await Promise.all([
                getAllMenuItems(),
                getAllCategories(),
            ]);

            setMenuItems(menuItemsRes.data.menuItems);
            setCategories(categoriesRes.data.categories);
        } catch (error) {
            toast.error('Failed to fetch menu data');
            console.error('Fetch data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category._id === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddToOrder = (item) => {
        const existingItem = currentOrder.find(orderItem => orderItem._id === item._id);

        if (existingItem) {
            setCurrentOrder(currentOrder.map(orderItem =>
                orderItem._id === item._id
                    ? { ...orderItem, quantity: orderItem.quantity + 1 }
                    : orderItem
            ));
        } else {
            setCurrentOrder([...currentOrder, { ...item, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (itemId, change) => {
        setCurrentOrder(currentOrder.map(item => {
            if (item._id === itemId) {
                const newQuantity = Math.max(0, item.quantity + change);
                return newQuantity === 0
                    ? null
                    : { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean));
    };

    const calculateSubtotal = () => {
        return currentOrder.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTax = (subtotal) => {
        return subtotal * 0.08; // 8% tax
    };

    const handleSubmit = async () => {
        if (currentOrder.length === 0) {
            toast.error('Please add items to the order');
            return;
        }

        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        const total = subtotal + tax;

        const orderData = {
            tableId,
            items: currentOrder.map(item => ({
                menuItemId: item._id,
                quantity: item.quantity,
                notes: item.notes || ''
            })),
            subtotal,
            tax,
            total
        };

        if (existingOrder) {
            orderData.orderId = existingOrder._id;
        }

        try {
            await onSubmit(orderData);
            setCurrentOrder([]);
            onClose();
        } catch (error) {
            toast.error('Failed to process order');
            console.error('Order error:', error);
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
                                                {existingOrder ? 'Edit Order' : 'New Order'}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">Table #{tableNumber}</p>
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
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                            ${selectedCategory === 'all'
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        All Items
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            onClick={() => setSelectedCategory(category._id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                                ${selectedCategory === category._id
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
                                    {loading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <p>Loading menu items...</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            {filteredItems.map((item) => (
                                                <motion.button
                                                    key={item._id}
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
                                    )}
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
                                                <div key={item._id} className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleQuantityChange(item._id, -1)}
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
                                                            onClick={() => handleQuantityChange(item._id, 1)}
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
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span>${calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax (8%)</span>
                                            <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>${(calculateSubtotal() + calculateTax(calculateSubtotal())).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={currentOrder.length === 0}
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
    // State for tables and orders
    const [tables, setTables] = useState([]);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showAddTable, setShowAddTable] = useState(false);
    const [showEditTable, setShowEditTable] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showViewOrder, setShowViewOrder] = useState(false);
    const [showTakeOrder, setShowTakeOrder] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('active');

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tablesRes, ordersRes, menuItemsRes, categoriesRes] = await Promise.all([
                getAllTables(),
                getAllOrders(),
                getAllMenuItems(),
                getAllCategories(),
            ]);

            setTables(tablesRes.data.tables);
            setOrders(ordersRes.data.orders);
            setMenuItems(menuItemsRes.data.menuItems);
            setCategories(categoriesRes.data.categories);
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Fetch data error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Table operations
    const handleAddTable = async (tableData) => {
        try {
            const response = await createTable(tableData);
            showToast.success('Table created successfully');
            setTables([...tables, response.data.table]);
            setShowAddTable(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleEditTable = async (id, tableData) => {
        try {
            const response = await updateTable(id, tableData);
            showToast.success('Table updated successfully');
            setTables(tables.map(table =>
                table._id === id ? response.data.table : table
            ));
            setShowEditTable(false);
            setSelectedTable(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleDeleteTable = async (id) => {
        try {
            await deleteTable(id);
            showToast.success('Table deleted successfully');
            setTables(tables.filter(table => table._id !== id));
            setShowDeleteConfirmation(false);
            setSelectedTable(null);
        } catch (error) {
            handleApiError(error);
        }
    };

    // Order operations
    const handleCreateOrder = async (tableId, orderData) => {
        try {
            const response = await createOrder({ tableId, ...orderData });
            showToast.success('Order created successfully');
            await fetchData();
            setShowTakeOrder(false);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleAddItemsToOrder = async (orderData) => {
        try {
            let response;
            if (!orderData.orderId) {
                const formattedData = {
                    tableId: orderData.tableId,
                    items: orderData.items,
                    subtotal: orderData.subtotal,
                    tax: orderData.tax,
                    total: orderData.total
                };

                response = await createOrder(formattedData);
                showToast.success('New order created successfully');
            } else {
                response = await addItemsToOrder(orderData.orderId, {
                    items: orderData.items,
                    subtotal: orderData.subtotal,
                    tax: orderData.tax,
                    total: orderData.total
                });
                showToast.success('Order updated successfully');
            }

            const updatedOrder = response.data.order;
            if (orderData.orderId) {
                setSelectedOrder(prev =>
                    prev.map(order =>
                        order._id === updatedOrder._id ? updatedOrder : order
                    )
                );
                setOrders(prev =>
                    prev.map(order =>
                        order._id === updatedOrder._id ? updatedOrder : order
                    )
                );
            } else {
                setSelectedOrder(prev => [...prev, updatedOrder]);
                setOrders(prev => [...prev, updatedOrder]);
            }
        } catch (error) {
            handleApiError(error);
            await fetchData();
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const response = await updateOrderStatus(orderId, status);
            const updatedOrder = response.data.order;

            if (status === 'completed' || status === 'cancelled') {
                showToast.info(`Order ${status} successfully`);

                // Check if there are any remaining active orders for this table
                const remainingActiveOrders = orders.filter(order =>
                    order.table._id === updatedOrder.table._id &&
                    order._id !== orderId &&
                    ['pending', 'in-progress'].includes(order.status)
                );

                // Only update table status if no active orders remain
                if (remainingActiveOrders.length === 0) {
                    setTables(prev =>
                        prev.map(table => {
                            if (table._id === updatedOrder.table._id) {
                                return { ...table, status: 'available' };
                            }
                            return table;
                        })
                    );
                }

                // If order is completed, trigger notification check for low stock
                if (status === 'completed') {
                    // Trigger notification check for low stock items
                    document.dispatchEvent(new Event('checkNotifications'));
                }
            } else {
                showToast.success('Order status updated successfully');
            }

            // Update the orders state with the new order status
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, status } : order
                )
            );

            if (selectedOrder) {
                setSelectedOrder(prev =>
                    prev.map(order =>
                        order._id === orderId ? { ...order, status } : order
                    )
                );
            }
        } catch (error) {
            handleApiError(error);
            await fetchData();
        }
    };

    const handleViewTableOrders = async (tableId, tableNumber) => {
        try {
            const response = await getOrdersByTable(tableId);
            setSelectedTable({ _id: tableId, number: tableNumber });
            setSelectedOrder(response.data.orders);
            setShowViewOrder(true);
        } catch (error) {
            toast.error('Failed to fetch table orders');
        }
    };

    const handleUpdateOrder = async (orderId, updatedData) => {
        try {
            const response = await updateOrder(orderId, updatedData);
            const updatedOrder = response.data.order;

            // Optimistically update both selected orders and active orders
            setSelectedOrder(prev =>
                prev.map(order =>
                    order._id === orderId ? updatedOrder : order
                )
            );
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? updatedOrder : order
                )
            );

            toast.success("Order updated successfully");
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error(error.response?.data?.message || "Failed to update order");
            // Refresh data in case of error
            await fetchData();
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
                                    Active Orders: <span className="font-medium">{orders.length}</span>
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
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <p>Loading tables...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {tables.map((table) => (
                                <motion.div
                                    key={table._id}
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
                                                onClick={() => {
                                                    setSelectedTable(table);
                                                    setShowEditTable(true);
                                                }}
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1 text-red-600 hover:text-red-900"
                                                onClick={() => {
                                                    setSelectedTable(table);
                                                    setShowDeleteConfirmation(true);
                                                }}
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
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="primary"
                                            className="flex-1"
                                            onClick={() => {
                                                if (table.status === 'available') {
                                                    setSelectedTable(table);
                                                    setShowTakeOrder(true);
                                                } else {
                                                    handleViewTableOrders(table._id, table.number);
                                                }
                                            }}
                                        >
                                            {table.status === 'available' ? 'Take Order' : 'View Orders'}
                                        </Button>

                                        {table.status === 'occupied' && (
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setSelectedTable(table);
                                                    setShowTakeOrder(true);
                                                }}
                                            >
                                                Add Order
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Orders Section */}
                <div className="mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`${activeTab === 'active'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Active Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`${activeTab === 'past'
                                    ? 'border-orange-500 text-orange-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Past Orders
                            </button>
                        </nav>
                    </div>

                    <div className="mt-4">
                        {activeTab === 'active' ? (
                            <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    {orders.filter(order => ['pending', 'in-progress'].includes(order.status)).map((order) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 sm:px-6 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-orange-600 font-medium">
                                                            #{order._id.slice(-6)}
                                                        </span>
                                                        <span className="font-medium">
                                                            Table {order.table.number}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(order.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {order.items.length} items • ${order.total.toFixed(2)}
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
                                                    <Select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                        className="text-sm"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {orders.filter(order => ['pending', 'in-progress'].includes(order.status)).length === 0 && (
                                        <div className="p-4 text-center text-gray-500">
                                            No active orders
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="divide-y divide-gray-200">
                                    {orders.filter(order => ['completed', 'cancelled'].includes(order.status)).map((order) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 sm:px-6 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-orange-600 font-medium">
                                                            #{order._id.slice(-6)}
                                                        </span>
                                                        <span className="font-medium">
                                                            Table {order.table.number}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(order.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {order.items.length} items • ${order.total.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                            ${order.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {orders.filter(order => ['completed', 'cancelled'].includes(order.status)).length === 0 && (
                                        <div className="p-4 text-center text-gray-500">
                                            No past orders
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <AddTableModal
                    isOpen={showAddTable}
                    onClose={() => setShowAddTable(false)}
                    onSubmit={handleAddTable}
                />
                <EditTableModal
                    isOpen={showEditTable}
                    onClose={() => {
                        setShowEditTable(false);
                        setSelectedTable(null);
                    }}
                    onSubmit={handleEditTable}
                    table={selectedTable}
                />
                <DeleteConfirmationModal
                    isOpen={showDeleteConfirmation}
                    onClose={() => {
                        setShowDeleteConfirmation(false);
                        setSelectedTable(null);
                    }}
                    onConfirm={() => handleDeleteTable(selectedTable._id)}
                    tableNumber={selectedTable?.number}
                />
                <ViewOrderModal
                    isOpen={showViewOrder}
                    onClose={() => {
                        setShowViewOrder(false);
                        setSelectedTable(null);
                        setSelectedOrder(null);
                    }}
                    tableId={selectedTable?._id}
                    tableNumber={selectedTable?.number}
                    orders={selectedOrder}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onAddItems={handleAddItemsToOrder}
                    onUpdateOrder={handleUpdateOrder}
                />
                <TakeOrderPanel
                    isOpen={showTakeOrder}
                    onClose={() => {
                        setShowTakeOrder(false);
                        setSelectedTable(null);
                    }}
                    tableId={selectedTable?._id}
                    tableNumber={selectedTable?.number}
                    onSubmit={handleCreateOrder}
                />
            </div>
        </DashboardLayout>
    );
} 