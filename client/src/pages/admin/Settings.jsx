import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BuildingStorefrontIcon,
    CameraIcon,
    BellIcon,
    ChartBarIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    TableCellsIcon,
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
        description: 'Configure notification preferences and alerts'
    }
];

const defaultNotificationSettings = {
    settings: [
        {
            id: 'low_stock_alerts',
            label: 'Low Stock Alerts',
            type: 'toggle',
            value: true,
            description: 'Get notified when items are running low on stock'
        },
        {
            id: 'order_updates',
            label: 'Order Updates',
            type: 'toggle',
            value: true,
            description: 'Notifications for new and updated orders'
        }
    ]
};

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
        type: '',
        size: ''
    });

    const [notificationSettings, setNotificationSettings] = useState(() => {
        const savedSettings = localStorage.getItem('notificationSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultNotificationSettings;
    });

    // Save notification settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        // Dispatch event to update notification settings across the app
        document.dispatchEvent(new CustomEvent('notificationSettingsChanged', {
            detail: notificationSettings
        }));
    }, [notificationSettings]);

    const handleNotificationSettingChange = (settingId, newValue) => {
        setNotificationSettings(prevSettings => ({
            ...prevSettings,
            settings: prevSettings.settings.map(setting => {
                if (setting.id === settingId) {
                    return { ...setting, value: newValue };
                }
                return setting;
            })
        }));
    };

    // Fetch restaurant details
    useEffect(() => {
        fetchRestaurantDetails();
    }, []);

    const fetchRestaurantDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getRestaurantDetailsApi();

            if (response.data.restaurant) {
                setRestaurantData({
                    name: response.data.restaurant.restaurantName || '',
                    ownerName: response.data.restaurant.ownerName || '',
                    email: response.data.restaurant.email || '',
                    phone: response.data.restaurant.phone || '',
                    address: response.data.restaurant.address || '',
                    type: response.data.restaurant.type || '',
                    size: response.data.restaurant.size || ''
                });
            } else {
                setError('No restaurant data found');
            }
        } catch (err) {
            setError('Failed to fetch restaurant details');
            toast.error('Failed to fetch restaurant details');
            console.error('Fetch restaurant details error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const updateData = {
                restaurantName: restaurantData.name,
                ownerName: restaurantData.ownerName,
                email: restaurantData.email,
                phone: restaurantData.phone,
                address: restaurantData.address,
                type: restaurantData.type,
                size: restaurantData.size
            };

            console.log('Updating restaurant with data:', updateData);
            const response = await updateRestaurantDetailsApi(updateData);

            if (response.data.success) {
                toast.success('Restaurant details updated successfully');
                setIsEditing(false);
                fetchRestaurantDetails();
            } else {
                toast.error(response.data.message || 'Failed to update restaurant details');
            }
        } catch (err) {
            console.error('Update restaurant details error:', err);
            console.error('Error response:', err.response?.data);
            toast.error(err.response?.data?.message || 'Failed to update restaurant details');
        }
    };

    const restaurantTypes = [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'cafe', label: 'Café' },
        { value: 'bar', label: 'Bar & Grill' },
        { value: 'fastfood', label: 'Fast Food' },
        { value: 'teahouse', label: 'Tea House' },
        { value: 'bakery', label: 'Bakery' },
        { value: 'pizzeria', label: 'Pizzeria' },
        { value: 'buffet', label: 'Buffet' },
        { value: 'foodtruck', label: 'Food Truck' }
    ];

    const restaurantSizes = [
        { value: 'small', label: 'Small (up to 50 seats)' },
        { value: 'medium', label: 'Medium (51-150 seats)' },
        { value: 'large', label: 'Large (151-300 seats)' },
        { value: 'xlarge', label: 'Extra Large (300+ seats)' }
    ];

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
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Restaurant Type</label>
                                                    <select
                                                        value={restaurantData.type}
                                                        onChange={(e) => setRestaurantData({ ...restaurantData, type: e.target.value })}
                                                        disabled={!isEditing}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-50"
                                                    >
                                                        <option value="">Select Type</option>
                                                        {restaurantTypes.map(type => (
                                                            <option key={type.value} value={type.value}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Restaurant Size</label>
                                                    <select
                                                        value={restaurantData.size}
                                                        onChange={(e) => setRestaurantData({ ...restaurantData, size: e.target.value })}
                                                        disabled={!isEditing}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-50"
                                                    >
                                                        <option value="">Select Size</option>
                                                        {restaurantSizes.map(size => (
                                                            <option key={size.value} value={size.value}>
                                                                {size.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
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

                        {activeSection === 'notifications' && (
                            <div className="bg-white rounded-2xl shadow-sm">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                                            <p className="mt-1 text-sm text-gray-500">Configure how you receive notifications</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-6">
                                        {notificationSettings.settings.map((setting) => (
                                            <div
                                                key={setting.id}
                                                className="flex flex-col space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900">
                                                            {setting.label}
                                                        </label>
                                                        <p className="text-sm text-gray-500">
                                                            {setting.description}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleNotificationSettingChange(setting.id, !setting.value)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.value ? 'bg-orange-500' : 'bg-gray-200'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.value ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 