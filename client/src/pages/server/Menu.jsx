import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    TableCellsIcon,
    BookOpenIcon,
    ClockIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { BookOpenIcon as BookOpenIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { getAllCategories, getAllMenuItems } from '../../apis/api';
import { toast } from 'react-toastify';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/server', current: false },
    { name: 'Tables & Orders', icon: TableCellsIcon, href: '/server/tables', current: false },
    { name: 'Menu', icon: BookOpenIcon, href: '/server/menu', current: true },
    { name: 'Order History', icon: ClockIcon, href: '/server/history', current: false },
];

export default function Menu() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    // Fetch categories and menu items
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, menuItemsResponse] = await Promise.all([
                    getAllCategories(),
                    getAllMenuItems()
                ]);

                setCategories([
                    { _id: 'all', name: 'All Items' },
                    ...categoriesResponse.data.categories
                ]);
                setMenuItems(menuItemsResponse.data.menuItems);
            } catch (error) {
                toast.error('Failed to fetch menu data');
            }
        };

        fetchData();
    }, []);

    // Filter items based on category and search query
    useEffect(() => {
        const filtered = menuItems.filter(item => {
            const matchesCategory = selectedCategory === 'all' ||
                item.category._id === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        setFilteredItems(filtered);
    }, [selectedCategory, searchQuery, menuItems]);

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <BookOpenIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Menu Items</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Browse and search through our menu items
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
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setSelectedCategory(category._id)}
                                className={`
                                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                                    ${selectedCategory === category._id
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }
                                `}
                            >
                                {category.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Menu Items Grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                        >
                            <div className="aspect-w-3 aspect-h-2">
                                <img
                                    src={item.image ? `${import.meta.env.VITE_API_URL}/menu/${item.image}` : '/placeholder-image.jpg'}
                                    alt={item.name}
                                    className="h-48 w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                <div className="mt-auto pt-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-medium text-orange-600">
                                            ${item.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            In Stock: {item.stock}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
} 