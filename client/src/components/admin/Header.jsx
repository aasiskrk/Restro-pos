import { useState, Fragment, useRef, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
    BellIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getDashboardStats } from '../../apis/api';

// iOS notification sound URL
const NOTIFICATION_SOUND_URL = 'https://notificationsounds.com/storage/sounds/file-sounds-1217-relax.ogg';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header({ onToggleSidebar }) {
    const navigate = useNavigate();
    const notificationButtonRef = useRef(null);
    const notificationSound = useRef(new Audio(NOTIFICATION_SOUND_URL));
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [lastNotificationCount, setLastNotificationCount] = useState(0);

    // Function to play notification sound
    const playNotificationSound = () => {
        notificationSound.current.play().catch(error => {
            console.error('Error playing notification sound:', error);
        });
    };

    // Fetch low stock items for notifications
    const fetchLowStockNotifications = async () => {
        try {
            const response = await getDashboardStats();
            if (response.data && response.data.data) {
                const { lowStockItems = [] } = response.data.data;

                // Create notifications for low stock items
                const newNotifications = lowStockItems.map(item => ({
                    id: item._id,
                    text: `Low stock alert: ${item.name} (${item.stock} remaining)`,
                    unread: true,
                    type: 'low-stock',
                    onClick: () => navigate('/admin/menu')  // Navigate to menu management when clicked
                }));

                // Check if there are new notifications
                if (newNotifications.length > lastNotificationCount && lastNotificationCount !== 0) {
                    // Play sound only if there are new notifications
                    playNotificationSound();

                    // Show browser notification if permitted
                    if (Notification.permission === 'granted') {
                        const newItems = newNotifications.slice(lastNotificationCount);
                        newItems.forEach(item => {
                            new Notification('Low Stock Alert', {
                                body: item.text,
                                icon: '/favicon.ico'
                            });
                        });
                    }
                }

                setLastNotificationCount(newNotifications.length);
                setNotifications(newNotifications);
                setHasUnread(newNotifications.some(n => n.unread));

                // Log for debugging
                console.log('Low stock items found:', lowStockItems.length);
                console.log('Notifications set:', newNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Request notification permission on component mount
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        fetchLowStockNotifications();
        // Refresh notifications every 15 seconds
        const interval = setInterval(fetchLowStockNotifications, 15000);

        // Add listener for immediate notification checks
        const handleCheckNotifications = () => {
            fetchLowStockNotifications();
        };
        document.addEventListener('checkNotifications', handleCheckNotifications);

        return () => {
            clearInterval(interval);
            document.removeEventListener('checkNotifications', handleCheckNotifications);
        };
    }, [navigate]);

    useEffect(() => {
        const handleOpenNotifications = () => {
            if (notificationButtonRef.current) {
                notificationButtonRef.current.click();
            }
        };

        document.addEventListener('openNotifications', handleOpenNotifications);
        return () => {
            document.removeEventListener('openNotifications', handleOpenNotifications);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const markAsRead = (notification) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(n =>
                n.id === notification.id
                    ? { ...n, unread: false }
                    : n
            )
        );
        setHasUnread(notifications.some(n => n.id !== notification.id && n.unread));

        // Navigate if onClick handler exists
        if (notification.onClick) {
            notification.onClick();
        }
    };

    const userNavigation = [
        { name: 'Profile', href: '/profile', icon: UserCircleIcon },
        { name: 'Settings', href: '/profile/settings', icon: Cog6ToothIcon },
        {
            name: 'Sign out',
            icon: ArrowRightOnRectangleIcon,
            onClick: handleLogout
        },
    ];

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center">
                    {/* Left section with hamburger and search */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            type="button"
                            className="p-2 rounded-md text-gray-500 hover:text-orange-600"
                            onClick={onToggleSidebar}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bars3Icon className="h-6 w-6 transition-transform duration-200 hover:rotate-180" />
                        </motion.button>

                        <div className="relative w-64">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <motion.input
                                type="search"
                                whileFocus={{ scale: 1.02 }}
                                className="block w-full rounded-md border-0 py-2 pl-10 pr-3 
                                    text-gray-900 ring-1 ring-inset ring-gray-300
                                    placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-orange-500
                                    hover:ring-gray-400
                                    transition-all duration-200"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right section */}
                    <div className="flex items-center gap-x-4">
                        {/* Notifications */}
                        <Menu as="div" className="relative">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Menu.Button
                                    ref={notificationButtonRef}
                                    className="relative flex rounded-full p-1.5 text-gray-400 hover:text-orange-500"
                                >
                                    {hasUnread ? (
                                        <BellIconSolid className="h-6 w-6 text-orange-500" />
                                    ) : (
                                        <BellIcon className="h-6 w-6" />
                                    )}
                                    {hasUnread && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white"
                                        />
                                    )}
                                </Menu.Button>
                            </motion.div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-100"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <Menu.Item key={notification.id}>
                                                {({ active }) => (
                                                    <motion.div
                                                        whileHover={{ x: 4 }}
                                                        className={classNames(
                                                            active ? 'bg-gray-50' : '',
                                                            'px-4 py-3 cursor-pointer'
                                                        )}
                                                        onClick={() => markAsRead(notification)}
                                                    >
                                                        <div className="flex items-start">
                                                            <div className={`w-2 h-2 mt-2 mr-2 rounded-full ${notification.unread ? 'bg-orange-500' : 'bg-gray-200'}`} />
                                                            <div>
                                                                <p className={`text-sm ${notification.unread ? 'font-medium' : ''} text-gray-900`}>
                                                                    {notification.text}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Click to view in Menu Management
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </Menu.Item>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                            No notifications
                                        </div>
                                    )}
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt=""
                                    />
                                </Menu.Button>
                            </motion.div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-100"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (
                                                item.onClick ? (
                                                    <button
                                                        onClick={item.onClick}
                                                        className={classNames(
                                                            active ? 'bg-gray-50' : '',
                                                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        <div className="flex items-center">
                                                            <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                                                            {item.name}
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={item.href}
                                                        className={classNames(
                                                            active ? 'bg-gray-50' : '',
                                                            'block px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        <div className="flex items-center">
                                                            <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                                                            {item.name}
                                                        </div>
                                                    </Link>
                                                )
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
} 