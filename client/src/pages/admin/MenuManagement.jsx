import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
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
    ViewColumnsIcon,
    FireIcon,
    CircleStackIcon,
    BoltIcon,
    CakeIcon,
    BeakerIcon,
    SparklesIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon as ClipboardDocumentListIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Input, Select, Button } from '../../components/common/Form';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: true },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Inventory', icon: CubeIcon, href: '/admin/inventory', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

const categories = [
    {
        id: 'all',
        name: 'All',
        items: '116',
        icon: ViewColumnsIcon
    },
    {
        id: 'pizza',
        name: 'Pizza',
        items: '20',
        icon: FireIcon
    },
    {
        id: 'burger',
        name: 'Burger',
        items: '15',
        icon: CircleStackIcon
    },
    {
        id: 'chicken',
        name: 'Chicken',
        items: '10',
        icon: BoltIcon
    },
    {
        id: 'bakery',
        name: 'Bakery',
        items: '18',
        icon: CakeIcon
    },
    {
        id: 'beverage',
        name: 'Beverage',
        items: '12',
        icon: BeakerIcon
    },
    {
        id: 'seafood',
        name: 'Seafood',
        items: '16',
        icon: SparklesIcon
    },
];

const menuItems = [
    {
        id: 'MI001',
        name: 'Chicken Parmesan',
        description: 'Breaded chicken with marinara sauce and melted mozzarella',
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        stock: '119 items',
        category: 'Chicken',
        price: '$55.00',
    },
    // Add more menu items...
];

function CategoryMenu({ onEdit, onDelete }) {
    return (
        <div className="absolute top-2 right-2">
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onEdit}
                                        className={`${active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                                            } group flex w-full items-center px-4 py-2 text-sm`}
                                    >
                                        <PencilSquareIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-orange-500" />
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={onDelete}
                                        className={`${active ? 'bg-red-50 text-red-900' : 'text-red-700'
                                            } group flex w-full items-center px-4 py-2 text-sm`}
                                    >
                                        <TrashIcon className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}

function EditCategoryPanel({ category, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: category.name,
        description: category.description,
        icon: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
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
                                <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
                                <button
                                    type="button"
                                    className="rounded-lg p-2 hover:bg-gray-100"
                                    onClick={onClose}
                                >
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Category Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />

                                {/* Icon Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Icon
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {category.icon ? (
                                                    <img
                                                        src={category.icon}
                                                        alt="Category icon"
                                                        className="w-16 h-16 mb-3"
                                                    />
                                                ) : (
                                                    <PlusIcon className="w-8 h-8 mb-4 text-gray-500" />
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Click to change icon
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.files[0] })}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>
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
    );
}

function AddCategoryPanel({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log(formData);
        onClose();
    };

    return (
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
                                <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
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
                                    label="Category Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Icon
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <PlusIcon className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.files[0] })}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>
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
                                    Add Category
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

function AddMenuItemPanel({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log(formData);
        onClose();
    };

    return (
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
                                <h2 className="text-xl font-semibold text-gray-900">Add New Menu Item</h2>
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
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Item Image
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            {formData.image ? (
                                                <img
                                                    src={URL.createObjectURL(formData.image)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <PlusIcon className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <Input
                                    label="Item Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />

                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Stock"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
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
                                    Add Menu Item
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default function MenuManagement() {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddMenuItem, setShowAddMenuItem] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [editingCategory, setEditingCategory] = useState(null);

    const filteredMenuItems = menuItems.filter(item =>
        selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory
    );

    const handleEditCategory = (category) => {
        setEditingCategory(category);
    };

    const handleDeleteCategory = (categoryId) => {
        // Add your delete logic here
        console.log('Deleting category:', categoryId);
    };

    const handleSaveCategory = (formData) => {
        // Add your save logic here
        console.log('Saving category:', formData);
        setEditingCategory(null);
    };

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ClipboardDocumentListIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Menu Management</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Total Items: <span className="font-medium">{menuItems.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddCategory(true)}
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                        <Button
                            onClick={() => setShowAddMenuItem(true)}
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Menu Item
                        </Button>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="mt-8">
                    <motion.div
                        layout
                        className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7"
                    >
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <motion.div
                                    key={category.id}
                                    layout
                                    className="relative"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`relative w-full flex flex-col items-center justify-center p-6 rounded-xl
                                            transition-all duration-200 gap-3 border
                                            ${selectedCategory === category.id
                                                ? 'bg-orange-50 border-orange-200 shadow-sm'
                                                : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                    >
                                        <Icon className={`h-6 w-6 ${selectedCategory === category.id ? 'text-orange-600' : 'text-gray-600'
                                            }`} />
                                        <div className="text-center">
                                            <span className={`text-sm font-medium ${selectedCategory === category.id ? 'text-orange-900' : 'text-gray-900'
                                                }`}>
                                                {category.name}
                                            </span>
                                            <p className="mt-1 text-xs text-gray-500">{category.items} items</p>
                                        </div>
                                    </motion.button>
                                    <CategoryMenu
                                        onEdit={() => handleEditCategory(category)}
                                        onDelete={() => handleDeleteCategory(category.id)}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Menu Items List */}
                <div className="mt-8">
                    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item & Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredMenuItems.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">{item.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.stock}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {item.price}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="text-orange-600 hover:text-orange-900"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Slide-over panels remain the same */}
                <AnimatePresence>
                    {showAddCategory && (
                        <AddCategoryPanel onClose={() => setShowAddCategory(false)} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showAddMenuItem && (
                        <AddMenuItemPanel onClose={() => setShowAddMenuItem(false)} />
                    )}
                </AnimatePresence>

                {/* Add EditCategoryPanel */}
                <AnimatePresence>
                    {editingCategory && (
                        <EditCategoryPanel
                            category={editingCategory}
                            onClose={() => setEditingCategory(null)}
                            onSave={handleSaveCategory}
                        />
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
} 