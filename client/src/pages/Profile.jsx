import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowLeftIcon,
    PencilIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const profileNavigation = [
    { name: 'Profile', icon: UserIcon, href: '/profile' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/profile/settings' },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon, href: '/logout' },
];

// Role-specific mock data
const roleData = {
    admin: {
        role: 'Administrator',
        permissions: [
            'Staff Management',
            'Menu Management',
            'Inventory Management',
            'Settings Management',
            'View Reports',
            'System Configuration'
        ]
    },
    server: {
        role: 'Server',
        permissions: [
            'Take Orders',
            'View Menu',
            'Update Order Status',
            'View Order History',
            'Call Kitchen'
        ]
    },
    cashier: {
        role: 'Cashier',
        permissions: [
            'Process Payments',
            'View Orders',
            'Split Bills',
            'Apply Discounts',
            'View Payment History'
        ]
    },
    kitchen: {
        role: 'Kitchen Staff',
        permissions: [
            'View Orders',
            'Update Order Status',
            'Manage Inventory',
            'View Menu',
            'Call Server'
        ]
    }
};

export default function Profile() {
    const [editMode, setEditMode] = useState(false);
    const location = useLocation();
    const [userRole, setUserRole] = useState('');

    // Determine user role from the current path
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/admin')) setUserRole('admin');
        else if (path.includes('/server')) setUserRole('server');
        else if (path.includes('/cashier')) setUserRole('cashier');
        else if (path.includes('/kitchen')) setUserRole('kitchen');
    }, [location]);

    const [formData, setFormData] = useState({
        fullName: 'John Smith',
        email: 'john.doe@dinetrack.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        department: roleData[userRole]?.role || '',
        role: roleData[userRole]?.role || '',
        permissions: roleData[userRole]?.permissions || []
    });

    // Update form data when role changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            department: roleData[userRole]?.role || '',
            role: roleData[userRole]?.role || '',
            permissions: roleData[userRole]?.permissions || []
        }));
    }, [userRole]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setEditMode(false);
        // Here you would typically save the changes to your backend
        console.log('Saving profile changes:', formData);
    };

    const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 p-6 border-b border-gray-200">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                        </div>
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {profileNavigation.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${item.name === 'Profile'
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                                    <UserIcon className="h-8 w-8 text-orange-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">{formData.fullName}</h1>
                                    <p className="text-sm text-gray-500">{formData.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => editMode ? handleSave() : setEditMode(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium"
                            >
                                {editMode ? 'Save Changes' : (
                                    <>
                                        <PencilIcon className="h-4 w-4" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role & Permissions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Role & Permissions</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <div className="flex items-center gap-2 text-orange-600 bg-orange-50 w-fit px-3 py-1.5 rounded-lg">
                                        <UserIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{formData.role}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permissions
                                    </label>
                                    <div className="space-y-2">
                                        {formData.permissions.map((permission, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2"
                                            >
                                                <svg
                                                    className="h-5 w-5 text-green-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm text-gray-600">{permission}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 