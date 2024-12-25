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
    FunnelIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Input, Select, Button } from '../../components/common/Form';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Inventory', icon: CubeIcon, href: '/admin/inventory', current: true },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

// Define filterOptions at the top level
const filterOptions = {
    stockLevels: [
        { value: 'all', label: 'All Stock Levels' },
        { value: 'in-stock', label: 'In Stock' },
        { value: 'low-stock', label: 'Low Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' },
        { value: 'critical', label: 'Critical Low' }
    ],
    itemType: [
        { value: 'all', label: 'All Types' },
        { value: 'meat', label: 'Meat & Poultry' },
        { value: 'seafood', label: 'Seafood' },
        { value: 'dairy', label: 'Dairy & Eggs' },
        { value: 'produce', label: 'Produce' },
        { value: 'dry-goods', label: 'Dry Goods' },
        { value: 'spices', label: 'Spices & Seasonings' },
        { value: 'beverages', label: 'Beverages' },
        { value: 'cleaning', label: 'Cleaning Supplies' },
        { value: 'disposables', label: 'Disposables' }
    ],
    units: [
        { value: 'kg', label: 'Kilograms (kg)' },
        { value: 'g', label: 'Grams (g)' },
        { value: 'l', label: 'Liters (L)' },
        { value: 'ml', label: 'Milliliters (ml)' },
        { value: 'pcs', label: 'Pieces' },
        { value: 'dozen', label: 'Dozen' },
        { value: 'box', label: 'Box' },
        { value: 'pack', label: 'Pack' },
        { value: 'bottle', label: 'Bottle' },
        { value: 'can', label: 'Can' }
    ]
};

// Mock data
const inventoryItems = [
    {
        id: 1,
        name: 'Chicken Parmesan',
        category: 'Chicken',
        status: 'Active',
        stockedProduct: '10 In Stock',
        retailPrice: 55.00,
    },
    // Add more items...
];

function AddInventoryModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        quantity: '',
        unit: '',
        price: '',
        minStock: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
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
                                        <h2 className="text-xl font-semibold text-gray-900">Add New Item</h2>
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
                                            label="Item Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Item Type
                                            </label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full border rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                {filterOptions.itemType
                                                    .filter(option => option.value !== 'all')
                                                    .map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Quantity"
                                                name="quantity"
                                                type="number"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                required
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Unit
                                                </label>
                                                <select
                                                    name="unit"
                                                    value={formData.unit}
                                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                    className="w-full border rounded-md p-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                >
                                                    <option value="">Select Unit</option>
                                                    {filterOptions.units.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Price per Unit"
                                                name="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                            />
                                            <Input
                                                label="Minimum Stock"
                                                name="minStock"
                                                type="number"
                                                min="0"
                                                value={formData.minStock}
                                                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Notes
                                            </label>
                                            <textarea
                                                name="description"
                                                rows={3}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Add any special notes or instructions..."
                                            />
                                        </div>
                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                                    <div className="flex justify-end gap-3">
                                        <Button variant="secondary" onClick={onClose}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSubmit}>
                                            Add Item
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

function EditInventoryModal({ isOpen, onClose, item }) {
    const [formData, setFormData] = useState(item || {});

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
                        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Edit Inventory Item</h2>
                                    <button onClick={onClose}>
                                        <XMarkIcon className="h-6 w-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <form className="p-6 space-y-4">
                                <Input
                                    label="Product Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <Select
                                    label="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    options={[
                                        { value: 'chicken', label: 'Chicken' },
                                        { value: 'beef', label: 'Beef' },
                                        { value: 'seafood', label: 'Seafood' },
                                        { value: 'produce', label: 'Produce' },
                                    ]}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                    <Select
                                        label="Unit"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        options={[
                                            { value: 'kg', label: 'Kilograms' },
                                            { value: 'lbs', label: 'Pounds' },
                                            { value: 'units', label: 'Units' },
                                        ]}
                                    />
                                </div>
                                <Input
                                    label="Price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                <Input
                                    label="Minimum Stock Level"
                                    type="number"
                                    value={formData.minStock}
                                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
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

function DeleteConfirmationModal({ isOpen, onClose, itemName }) {
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
                                <h3 className="text-lg font-medium text-gray-900">Delete Inventory Item</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Are you sure you want to delete "{itemName}"? This action cannot be undone.
                                </p>
                                <div className="mt-4 flex justify-center gap-3">
                                    <Button variant="secondary" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger">
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

export default function Inventory() {
    const [showAddInventory, setShowAddInventory] = useState(false);
    const [filters, setFilters] = useState({
        stockLevel: 'all',
        itemType: 'all'
    });
    const [showEditInventory, setShowEditInventory] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setShowEditInventory(true);
    };

    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setShowDeleteConfirmation(true);
    };

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <CubeIcon className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Total Products: <span className="font-medium">150</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Button onClick={() => setShowAddInventory(true)}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add New Item
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-8 flex flex-col lg:flex-row gap-8">
                    {/* Table Section */}
                    <div className="flex-1">
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Item Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {inventoryItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                                        <CubeIcon className="h-6 w-6 text-orange-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500">{item.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${item.stockLevel === 'in-stock' ? 'bg-green-100 text-green-800' :
                                                        item.stockLevel === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
                                                            item.stockLevel === 'out-of-stock' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'}`}>
                                                    {item.stockLevel === 'in-stock' ? 'In Stock' :
                                                        item.stockLevel === 'low-stock' ? 'Low Stock' :
                                                            item.stockLevel === 'out-of-stock' ? 'Out of Stock' :
                                                                'Overstock'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.stockedProduct}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ${item.retailPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEditClick(item)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Filters Sidebar */}
                    <div className="lg:w-64 bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Stock Level</h3>
                                <div className="mt-2">
                                    <select
                                        value={filters.stockLevel}
                                        onChange={(e) => setFilters({ ...filters, stockLevel: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        {filterOptions.stockLevels.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Item Type</h3>
                                <div className="mt-2">
                                    <select
                                        value={filters.itemType}
                                        onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        {filterOptions.itemType.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => setFilters({
                                    stockLevel: 'all',
                                    itemType: 'all'
                                })}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AddInventoryModal
                isOpen={showAddInventory}
                onClose={() => setShowAddInventory(false)}
            />
            <EditInventoryModal
                isOpen={showEditInventory}
                onClose={() => {
                    setShowEditInventory(false);
                    setSelectedItem(null);
                }}
                item={selectedItem}
            />
            <DeleteConfirmationModal
                isOpen={showDeleteConfirmation}
                onClose={() => {
                    setShowDeleteConfirmation(false);
                    setSelectedItem(null);
                }}
                itemName={selectedItem?.name}
            />
        </DashboardLayout>
    );
} 