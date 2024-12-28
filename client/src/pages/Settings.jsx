import { useState } from 'react';
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowLeftIcon,
    BellIcon,
    ArrowRightOnRectangleIcon,
    LockClosedIcon,
    LanguageIcon,
    SunIcon,
} from '@heroicons/react/24/outline';

const profileNavigation = [
    { name: 'Profile', icon: UserIcon, href: '/profile' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/profile/settings' },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon, href: '/logout' },
];

const settingsSections = [
    {
        id: 'notifications',
        title: 'Notifications',
        icon: BellIcon,
        settings: [
            { id: 'order_updates', label: 'Order Updates', type: 'toggle', value: true },
            { id: 'table_alerts', label: 'Table Alerts', type: 'toggle', value: true },
            { id: 'system_notifications', label: 'System Notifications', type: 'toggle', value: false },
        ]
    },
    {
        id: 'appearance',
        title: 'Appearance',
        icon: SunIcon,
        settings: [
            {
                id: 'theme',
                label: 'Theme',
                type: 'select',
                value: 'light',
                options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                ]
            }
        ]
    },
    {
        id: 'language',
        title: 'Language & Region',
        icon: LanguageIcon,
        settings: [
            {
                id: 'language',
                label: 'Language',
                type: 'select',
                value: 'en',
                options: [
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                ]
            }
        ]
    },
    {
        id: 'security',
        title: 'Security',
        icon: LockClosedIcon,
        settings: [
            { id: 'two_factor', label: 'Two-factor Authentication', type: 'toggle', value: false },
            {
                id: 'session_timeout', label: 'Auto Logout After', type: 'select', value: '30',
                options: [
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                ]
            },
        ]
    },
];

export default function ProfileSettings() {
    const [settings, setSettings] = useState(settingsSections);

    const handleSettingChange = (sectionId, settingId, newValue) => {
        setSettings(prevSettings =>
            prevSettings.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        settings: section.settings.map(setting => {
                            if (setting.id === settingId) {
                                return { ...setting, value: newValue };
                            }
                            return setting;
                        })
                    };
                }
                return section;
            })
        );
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
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-8">
                            {settings.map((section) => (
                                <div
                                    key={section.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <section.icon className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="space-y-6">
                                        {section.settings.map((setting) => (
                                            <div
                                                key={setting.id}
                                                className="flex items-center justify-between"
                                            >
                                                <label className="text-sm font-medium text-gray-900">
                                                    {setting.label}
                                                </label>
                                                {setting.type === 'toggle' ? (
                                                    <button
                                                        onClick={() => handleSettingChange(section.id, setting.id, !setting.value)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.value ? 'bg-orange-500' : 'bg-gray-200'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${setting.value ? 'translate-x-6' : 'translate-x-1'
                                                                }`}
                                                        />
                                                    </button>
                                                ) : setting.type === 'select' ? (
                                                    <select
                                                        value={setting.value}
                                                        onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
                                                        className="block rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                    >
                                                        {setting.options.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 