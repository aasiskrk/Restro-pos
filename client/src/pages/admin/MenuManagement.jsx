import { useState, Fragment, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon as ClipboardDocumentListIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Input, Select, Button } from '../../components/common/Form';
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    createMenuItem,
    getAllMenuItems,
    getMenuItemsByCategory,
    updateMenuItem,
    deleteMenuItem,
} from '../../apis/api';
import { toast } from 'react-toastify';
import { showToast, handleApiError } from '../../utils/toast';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: true },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

function CategoryMenu({ onEdit, onDelete }) {
    return (
        <div className="absolute top-2 right-2">
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
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
        description: category.description || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateCategory(category._id, formData);
            toast.success('Category updated successfully');
            onSave(response.data.category);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
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

function AddCategoryPanel({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createCategory(formData);
            toast.success('Category created successfully');
            onAdd(response.data.category);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create category');
        }
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

function AddMenuItemPanel({ onClose, onAdd, categories }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await createMenuItem(formData);
            toast.success('Menu item created successfully');
            // onAdd(response.data.menuItem);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create menu item');
        } finally {
            setIsSubmitting(false);
        }
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
                                        <option key={category._id} value={category._id}>
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
                                <Button onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Menu Item'}
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

function EditMenuItemPanel({ item, onClose, onSave, categories }) {
    const [formData, setFormData] = useState({
        name: item.name,
        description: item.description,
        category: item.category._id || item.category,
        price: item.price,
        stock: item.stock,
        image: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                    formDataToSend.append('image', formData[key]);
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await updateMenuItem(item._id, formDataToSend);
            toast.success('Menu item updated successfully');
            onSave(response.data.menuItem);
            onClose();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update menu item');
        }
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
                                <h2 className="text-xl font-semibold text-gray-900">Edit Menu Item</h2>
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
                                            ) : item.image ? (
                                                <img
                                                    src={`/menu/${item.image}`}
                                                    alt={item.name}
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
                                        <option key={category._id} value={category._id}>
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

export default function MenuManagement() {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddMenuItem, setShowAddMenuItem] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [editingCategory, setEditingCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [editingMenuItem, setEditingMenuItem] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchMenuItems();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data.categories);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const fetchMenuItems = async () => {
        try {
            const response = await getAllMenuItems();
            const items = response.data.menuItems;
            setAllMenuItems(items);
            if (selectedCategory === 'all') {
                setMenuItems(items);
            } else {
                setMenuItems(items.filter(item =>
                    item.category._id === selectedCategory || item.category === selectedCategory
                ));
            }
        } catch (error) {
            toast.error('Failed to fetch menu items');
        }
    };

    useEffect(() => {
        if (selectedCategory === 'all') {
            setMenuItems(allMenuItems);
        } else {
            setMenuItems(allMenuItems.filter(item =>
                item.category._id === selectedCategory || item.category === selectedCategory
            ));
        }
    }, [selectedCategory, allMenuItems]);

    const getCategoryItemCount = (categoryId) => {
        return allMenuItems.filter(item =>
            item.category._id === categoryId || item.category === categoryId
        ).length;
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategory(categoryId);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleSaveCategory = async (updatedCategory) => {
        setCategories(categories.map(cat =>
            cat._id === updatedCategory._id ? updatedCategory : cat
        ));
    };

    const handleAddCategory = async (newCategory) => {
        setCategories([...categories, newCategory]);
    };

    const handleAddMenuItem = async (menuData) => {
        try {
            const response = await createMenuItem(menuData);
            toast.success("Menu item added successfully!");

            const newItem = response.data.menuItem;
            setAllMenuItems(prev => [...prev, newItem]);

            if (selectedCategory === 'all' || selectedCategory === newItem.category) {
                setMenuItems(prev => [...prev, newItem]);
            }

            setShowAddMenuItem(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to add menu item."
            );
        }
    };

    const handleDeleteMenuItem = async (id) => {
        try {
            await deleteMenuItem(id);
            toast.success('Menu item deleted successfully');
            fetchMenuItems();
        } catch (error) {
            toast.error('Failed to delete menu item');
        }
    };

    const handleEditMenuItem = (item) => {
        setEditingMenuItem(item);
    };

    const handleSaveMenuItem = (updatedItem) => {
        setMenuItems(menuItems.map(item =>
            item._id === updatedItem._id ? updatedItem : item
        ));
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
                                    Total Items: <span className="font-medium">{allMenuItems.length}</span>
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
                        <motion.button
                            key="all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCategory('all')}
                            className={`relative w-full flex flex-col items-center justify-center p-6 rounded-xl
                                transition-all duration-200 gap-3 border
                                ${selectedCategory === 'all'
                                    ? 'bg-orange-50 border-orange-200 shadow-sm'
                                    : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                        >
                            <div className="text-center">
                                <span className={`text-sm font-medium ${selectedCategory === 'all' ? 'text-orange-900' : 'text-gray-900'}`}>
                                    All Items
                                </span>
                                <p className="mt-1 text-xs text-gray-500">{allMenuItems.length} items</p>
                            </div>
                        </motion.button>

                        {categories.map((category) => {
                            const categoryItemsCount = getCategoryItemCount(category._id);

                            return (
                                <motion.div
                                    key={category._id}
                                    layout
                                    className="relative"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedCategory(category._id)}
                                        className={`relative w-full flex flex-col items-center justify-center p-6 rounded-xl
                                            transition-all duration-200 gap-3 border
                                            ${selectedCategory === category._id
                                                ? 'bg-orange-50 border-orange-200 shadow-sm'
                                                : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                    >
                                        <div className="text-center">
                                            <span className={`text-sm font-medium ${selectedCategory === category._id ? 'text-orange-900' : 'text-gray-900'}`}>
                                                {category.name}
                                            </span>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {categoryItemsCount} items
                                            </p>
                                        </div>
                                    </motion.button>
                                    <CategoryMenu
                                        onEdit={() => handleEditCategory(category)}
                                        onDelete={() => handleDeleteCategory(category._id)}
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
                                {menuItems.map((item) => (
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
                                                    src={item.image ? `/menu/${item.image}` : '/placeholder-image.jpg'}
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
                                                {item.category?.name || categories.find(cat => cat._id === item.category)?._id || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.stock} items
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="text-orange-600 hover:text-orange-900"
                                                    onClick={() => handleEditMenuItem(item)}
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDeleteMenuItem(item._id)}
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

                {/* Slide-over panels */}
                <AnimatePresence>
                    {showAddCategory && (
                        <AddCategoryPanel
                            onClose={() => setShowAddCategory(false)}
                            onAdd={handleAddCategory}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showAddMenuItem && (
                        <AddMenuItemPanel
                            onClose={() => setShowAddMenuItem(false)}
                            onAdd={handleAddMenuItem}
                            categories={categories}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {editingCategory && (
                        <EditCategoryPanel
                            category={editingCategory}
                            onClose={() => setEditingCategory(null)}
                            onSave={handleSaveCategory}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {editingMenuItem && (
                        <EditMenuItemPanel
                            item={editingMenuItem}
                            onClose={() => setEditingMenuItem(null)}
                            onSave={handleSaveMenuItem}
                            categories={categories}
                        />
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
} 