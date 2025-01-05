import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BuildingStorefrontIcon,
    CameraIcon,
    BellIcon,
    KeyIcon,
    UserCircleIcon,
    CreditCardIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    ChartBarIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    TableCellsIcon,
    CubeIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { Input, Button } from '../../components/common/Form';
import { getRestaurantDetailsApi, updateRestaurantDetailsApi } from '../../apis/api';
import { toast } from 'react-hot-toast';

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIcon, href: '/admin/staff', current: false },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: true },
];

const settingsSections = [
    {
        id: 'restaurant',
        name: 'Restaurant Profile',
        icon: BuildingStorefrontIcon,
        description: 'Manage your restaurant information and branding'
    },
    {
        id: 'notifications',
        name: 'Notifications',
        icon: BellIcon,
        description: 'Configure how you receive alerts and notifications'
    },
    {
        id: 'security',
        name: 'Security',
        icon: KeyIcon,
        description: 'Manage account security and authentication'
    },
    {
        id: 'billing',
        name: 'Billing & Subscription',
        icon: CreditCardIcon,
        description: 'Manage your subscription and payment methods'
    },
    {
        id: 'team',
        name: 'Team Management',
        icon: UserCircleIcon,
        description: 'Configure team roles and permissions'
    },
    {
        id: 'integrations',
        name: 'Integrations',
        icon: GlobeAltIcon,
        description: 'Connect with third-party services and apps'
    }
];

export default function Settings() {
    const [activeSection, setActiveSection] = useState('restaurant');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        logo: null
    });

    // Fetch restaurant details
    useEffect(() => {
        fetchRestaurantDetails();
    }, []);

    const fetchRestaurantDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getRestaurantDetailsApi();
            console.log('Fetched restaurant data:', response.data); // Debug log

            if (response.data.restaurant) {
                setRestaurantData({
                    name: response.data.restaurant.restaurantName || '',
                    ownerName: response.data.restaurant.ownerName || '',
                    email: response.data.restaurant.email || '',
                    phone: response.data.restaurant.phone || '',
                    address: response.data.restaurant.address || '',
                    logo: response.data.restaurant.logo || null
                });
            } else {
                setError('No restaurant data found');
            }
        } catch (err) {
            console.log('Fetch error details:', err.response?.data); // Debug log
            setError('Failed to fetch restaurant details');
            toast.error('Failed to fetch restaurant details');
            console.error('Fetch restaurant details error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Create update data with empty strings instead of undefined
            const updateData = {
                restaurantName: restaurantData.name,
                ownerName: restaurantData.ownerName,
                email: restaurantData.email,
                phone: restaurantData.phone,
                address: restaurantData.address
            };

            console.log('Sending update data:', updateData); // Debug log

            const response = await updateRestaurantDetailsApi(updateData);
            console.log('Response:', response); // Debug log

            if (response.data.success) {
                toast.success('Restaurant details updated successfully');
                setIsEditing(false);
                fetchRestaurantDetails();
            } else {
                toast.error(response.data.message || 'Failed to update restaurant details');
            }
        } catch (err) {
            console.log('Error details:', err.response?.data); // Debug log
            toast.error(err.response?.data?.message || 'Failed to update restaurant details');
            console.error('Update restaurant details error:', err);
        }
    };

    return (
        <DashboardLayout navigation={navigation}>
            <div className="flex h-full">
                {/* Settings Navigation */}
                <div className="hidden lg:block w-80 border-r border-gray-200 bg-white overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                        <p className="mt-1 text-sm text-gray-500">Manage your restaurant preferences</p>
                    </div>
                    <nav className="space-y-1 px-3">
                        {settingsSections.map((section) => (
                            <motion.button
                                key={section.id}
                                whileHover={{ x: 4 }}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-3 py-4 text-left rounded-lg transition-colors
                                    ${activeSection === section.id
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <section.icon className={`h-5 w-5 ${activeSection === section.id ? 'text-orange-600' : 'text-gray-400'
                                    }`} />
                                <div>
                                    <p className="text-sm font-medium">{section.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                                </div>
                            </motion.button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                        {activeSection === 'restaurant' && (
                            <div className="bg-white rounded-2xl shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Restaurant Profile</h2>
                                            <p className="mt-1 text-sm text-gray-500">Update your restaurant's information</p>
                                        </div>
                                        <Button
                                            onClick={() => setIsEditing(!isEditing)}
                                            variant={isEditing ? "secondary" : "primary"}
                                            disabled={isLoading}
                                        >
                                            {isEditing ? 'Cancel' : 'Edit Profile'}
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center text-red-500 py-8">{error}</div>
                                    ) : (
                                        <>
                                            {/* Logo Upload */}
                                            <div className="flex justify-center mb-8">
                                                <div className="relative">
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        className="h-32 w-32 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300"
                                                    >
                                                        {restaurantData.logo ? (
                                                            <img
                                                                src={restaurantData.logo}
                                                                alt="Restaurant logo"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <BuildingStorefrontIcon className="h-16 w-16 text-gray-400" />
                                                        )}
                                                    </motion.div>
                                                    {isEditing && (
                                                        <motion.label
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="absolute -bottom-2 -right-2 p-2 bg-orange-500 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
                                                        >
                                                            <CameraIcon className="h-5 w-5 text-white" />
                                                            <input type="file" className="hidden" accept="image/*" />
                                                        </motion.label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Form Fields */}
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                <Input
                                                    label="Restaurant Name"
                                                    value={restaurantData.name}
                                                    onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                                <Input
                                                    label="Owner Name"
                                                    value={restaurantData.ownerName}
                                                    onChange={(e) => setRestaurantData({ ...restaurantData, ownerName: e.target.value })}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                                <Input
                                                    label="Email"
                                                    type="email"
                                                    value={restaurantData.email}
                                                    onChange={(e) => setRestaurantData({ ...restaurantData, email: e.target.value })}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                                <Input
                                                    label="Phone"
                                                    value={restaurantData.phone}
                                                    onChange={(e) => setRestaurantData({ ...restaurantData, phone: e.target.value })}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                                <div className="sm:col-span-2">
                                                    <Input
                                                        label="Address"
                                                        value={restaurantData.address}
                                                        onChange={(e) => setRestaurantData({ ...restaurantData, address: e.target.value })}
                                                        disabled={!isEditing}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="flex justify-end mt-6">
                                                    <Button onClick={handleSave}>
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Add other section content here */}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 