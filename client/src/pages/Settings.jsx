import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowLeftIcon,
    BellIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { logout } from '../apis/api';

const profileNavigation = [
    { name: 'Profile', icon: UserIcon, href: '/profile' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/profile/settings' },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon, href: '/logout' },
];

const defaultSettings = {
    id: 'notifications',
    title: 'Notifications',
    icon: BellIcon,
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

export default function ProfileSettings() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(() => {
        // Load settings from localStorage or use defaults
        const savedSettings = localStorage.getItem('notificationSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        // Dispatch event to update notification settings across the app
        document.dispatchEvent(new CustomEvent('notificationSettingsChanged', {
            detail: settings
        }));
    }, [settings]);

    const handleSettingChange = (settingId, newValue) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            settings: prevSettings.settings.map(setting => {
                if (setting.id === settingId) {
                    return { ...setting, value: newValue };
                }
                return setting;
            })
        }));
    };

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
                                        {item.name === 'Logout' ? (
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 w-full"
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                            </button>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${item.name === 'Settings'
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <BellIcon className="h-5 w-5 text-orange-600" />
                                </div>
                                <h2 className="text-lg font-medium text-gray-900">
                                    {settings.title}
                                </h2>
                            </div>
                            <div className="space-y-6">
                                {settings.settings.map((setting) => (
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
                                                onClick={() => handleSettingChange(setting.id, !setting.value)}
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
                </div>
            </div>
        </div>
    );
} 