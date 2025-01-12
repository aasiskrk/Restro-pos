import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TableCellsIcon,
    BellAlertIcon,
    ClockIcon,
    UserGroupIcon,
    BellIcon,
    XMarkIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { BellAlertIcon as BellAlertIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Input, Button } from '../../components/common/Form';
import { getAllMenuItems, updateMenuItem } from '../../apis/api';
import { toast } from 'react-toastify';

const navigation = [
    { name: 'Kitchen Display', icon: TableCellsIcon, href: '/kitchen', current: false },
    { name: 'Inventory Alert', icon: BellAlertIcon, href: '/kitchen/inventory', current: true },
];

export default function InventoryAlert() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [editStock, setEditStock] = useState('');

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await getAllMenuItems();
            const items = response.data.menuItems.filter(item => item.stock < 10);
            setMenuItems(items);
        } catch (error) {
            toast.error('Failed to fetch inventory items');
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (itemId) => {
        try {
            const newStock = parseInt(editStock);
            if (isNaN(newStock) || newStock < 0) {
                toast.error('Please enter a valid stock number');
                return;
            }

            await updateMenuItem(itemId, { stock: newStock });
            toast.success('Stock updated successfully');

            // Update local state
            setMenuItems(prevItems =>
                prevItems.map(item =>
                    item._id === itemId
                        ? { ...item, stock: newStock }
                        : item
                )
            );

            setEditingItem(null);
            setEditStock('');

            // Refresh the list if stock is no longer low
            if (newStock >= 10) {
                fetchMenuItems();
            }
        } catch (error) {
            toast.error('Failed to update stock');
            console.error('Error updating stock:', error);
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
                                <BellAlertIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Inventory Alerts</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Items with low stock (less than 10 units)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button
                            variant="primary"
                            className="flex items-center gap-2"
                            onClick={() => window.location.href = '/kitchen'}
                        >
                            <TableCellsIcon className="h-5 w-5" />
                            Kitchen Display
                        </Button>
                    </div>
                </div>

                {/* Inventory List */}
                <div className="mt-8">
                    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item & Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Current Stock
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : menuItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                            No items with low stock
                                        </td>
                                    </tr>
                                ) : (
                                    menuItems.map((item) => (
                                        <motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.image ? `${import.meta.env.VITE_API_URL}/menu/${item.image}` : '/placeholder-image.jpg'}
                                                        alt={item.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                {item.category.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingItem === item._id ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            value={editStock}
                                                            onChange={(e) => setEditStock(e.target.value)}
                                                            min="0"
                                                            className="w-24"
                                                        />
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => handleUpdateStock(item._id)}
                                                            className="text-sm"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => {
                                                                setEditingItem(null);
                                                                setEditStock('');
                                                            }}
                                                            className="text-sm"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock === 0
                                                            ? 'bg-red-100 text-red-800'
                                                            : item.stock < 5
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {item.stock} units
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setEditingItem(item._id);
                                                                setEditStock(item.stock.toString());
                                                            }}
                                                            className="text-orange-600 hover:text-orange-900"
                                                        >
                                                            <PencilSquareIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                {item.stock === 0 && (
                                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 