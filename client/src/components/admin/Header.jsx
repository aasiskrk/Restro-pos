import { useState, Fragment, useRef, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
    BellIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getDashboardStats, getActiveOrders, getAllOrders } from '../../apis/api';

// Define multiple audio formats for better browser compatibility
const NOTIFICATION_SOUNDS = {
    newOrder: {
        mp3: '/sounds/notification.mp3',  // You'll need to add these sound files to your public folder
        ogg: '/sounds/notification.ogg'
    }
};

// Pre-load audio for instant playback
const audioElements = {};
Object.keys(NOTIFICATION_SOUNDS).forEach(key => {
    audioElements[key] = new Audio();
    // Try MP3 first, fallback to OGG
    audioElements[key].src = NOTIFICATION_SOUNDS[key].mp3;
    audioElements[key].volume = 0.5;
    audioElements[key].load(); // Preload the audio
});

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header({ onToggleSidebar }) {
    const navigate = useNavigate();
    const notificationButtonRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [lastNotificationCount, setLastNotificationCount] = useState(0);
    const [lastOrdersState, setLastOrdersState] = useState({});
    const [notificationSettings, setNotificationSettings] = useState(() => {
        const savedSettings = localStorage.getItem('notificationSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            settings: [
                { id: 'low_stock_alerts', value: true },
                { id: 'order_updates', value: true },
                { id: 'sound_enabled', value: true }
            ]
        };
    });

    // Function to play notification sound
    const playNotificationSound = () => {
        const soundEnabled = notificationSettings.settings.find(s => s.id === 'sound_enabled')?.value;
        if (!soundEnabled) return;

        try {
            // Create a new instance each time to allow overlapping sounds
            const sound = new Audio(audioElements.newOrder.src);
            sound.volume = 0.5;

            // Play sound only after user interaction
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Error playing sound:', error);
                    // If autoplay was prevented, try playing on next user interaction
                    document.addEventListener('click', () => {
                        sound.play().catch(console.error);
                    }, { once: true });
                });
            }
        } catch (error) {
            console.error('Error creating audio:', error);
        }
    };

    // Function to show desktop notification
    const showDesktopNotification = async (title, body) => {
        try {
            // Check if the browser supports notifications
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notifications");
                return;
            }

            // Check if we already have permission
            if (Notification.permission === "granted") {
                const notification = new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'order-notification', // Group similar notifications
                    renotify: true, // Show each notification even if it has the same tag
                    requireInteraction: true, // Notification will stay until user interacts
                    silent: true // We handle sound separately
                });

                notification.onclick = () => {
                    window.focus();
                    navigate('/admin/orders');
                    notification.close();
                };
            }
            // If we don't have permission, request it on first user interaction
            else if (Notification.permission !== "denied") {
                document.addEventListener('click', async () => {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        showDesktopNotification(title, body);
                    }
                }, { once: true });
            }
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    };

    // Request notification permission on first user interaction
    useEffect(() => {
        const requestPermissionOnInteraction = () => {
            if (Notification.permission === "default") {
                document.addEventListener('click', async () => {
                    try {
                        const permission = await Notification.requestPermission();
                        if (permission === "granted") {
                            showDesktopNotification(
                                'Notifications Enabled',
                                'You will now receive order notifications'
                            );
                        }
                    } catch (error) {
                        console.error('Error requesting notification permission:', error);
                    }
                }, { once: true });
            }
        };

        requestPermissionOnInteraction();
    }, []);

    // Listen for notification settings changes
    useEffect(() => {
        const handleSettingsChange = (event) => {
            setNotificationSettings(event.detail);
        };

        document.addEventListener('notificationSettingsChanged', handleSettingsChange);
        return () => {
            document.removeEventListener('notificationSettingsChanged', handleSettingsChange);
        };
    }, []);

    // Fetch order notifications
    const fetchOrderNotifications = async () => {
        try {
            const orderUpdatesEnabled = notificationSettings.settings.find(s => s.id === 'order_updates')?.value;
            if (!orderUpdatesEnabled) return [];

            const [activeOrdersRes, allOrdersRes] = await Promise.all([
                getActiveOrders(),
                getAllOrders()
            ]);

            console.log('Fetched orders:', { activeOrders: activeOrdersRes.data, allOrders: allOrdersRes.data }); // Debug log

            const activeOrders = activeOrdersRes.data.orders || [];
            const allOrders = allOrdersRes.data.orders || [];

            // Get recent orders (last 24 hours)
            const recentOrders = allOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                const now = new Date();
                const diffHours = (now - orderDate) / (1000 * 60 * 60);
                return diffHours <= 24;
            });

            const currentOrdersState = {
                pending: activeOrders.filter(order => order.status === 'pending').length,
                inProgress: activeOrders.filter(order => order.status === 'in-progress').length,
                completed: recentOrders.filter(order => order.status === 'completed').length,
                cancelled: recentOrders.filter(order => order.status === 'cancelled').length
            };

            console.log('Current orders state:', currentOrdersState); // Debug log

            // Generate notifications for changes and current state
            const orderNotifications = [];

            // Add notifications for current state
            if (currentOrdersState.pending > 0) {
                orderNotifications.push({
                    id: `current-pending-${Date.now()}`,
                    text: `${currentOrdersState.pending} pending order${currentOrdersState.pending > 1 ? 's' : ''} waiting`,
                    unread: true,
                    type: 'order',
                    onClick: () => navigate('/admin/orders')
                });
            }

            if (currentOrdersState.inProgress > 0) {
                orderNotifications.push({
                    id: `current-progress-${Date.now()}`,
                    text: `${currentOrdersState.inProgress} order${currentOrdersState.inProgress > 1 ? 's' : ''} in progress`,
                    unread: true,
                    type: 'order',
                    onClick: () => navigate('/admin/orders')
                });
            }

            // Add notifications for changes
            if (lastOrdersState.pending !== undefined) {
                // Only show change notifications if there are actual changes
                const newPending = currentOrdersState.pending - lastOrdersState.pending;
                if (newPending > 0) {
                    const text = `${newPending} new pending order${newPending > 1 ? 's' : ''} received`;
                    orderNotifications.push({
                        id: `new-pending-${Date.now()}`,
                        text,
                        unread: true,
                        type: 'order',
                        onClick: () => navigate('/admin/orders')
                    });
                    playNotificationSound();
                    showDesktopNotification('New Order!', text);
                }

                const newInProgress = currentOrdersState.inProgress - lastOrdersState.inProgress;
                if (newInProgress > 0) {
                    const text = `${newInProgress} order${newInProgress > 1 ? 's' : ''} moved to in-progress`;
                    orderNotifications.push({
                        id: `new-progress-${Date.now()}`,
                        text,
                        unread: true,
                        type: 'order',
                        onClick: () => navigate('/admin/orders')
                    });
                    playNotificationSound();
                    showDesktopNotification('Order Status Update', text);
                }

                const newCompleted = currentOrdersState.completed - lastOrdersState.completed;
                if (newCompleted > 0) {
                    const text = `${newCompleted} order${newCompleted > 1 ? 's' : ''} just completed`;
                    orderNotifications.push({
                        id: `new-completed-${Date.now()}`,
                        text,
                        unread: true,
                        type: 'order',
                        onClick: () => navigate('/admin/orders')
                    });
                    playNotificationSound();
                    showDesktopNotification('Order Completed', text);
                }

                const newCancelled = currentOrdersState.cancelled - lastOrdersState.cancelled;
                if (newCancelled > 0) {
                    const text = `${newCancelled} order${newCancelled > 1 ? 's' : ''} cancelled`;
                    orderNotifications.push({
                        id: `new-cancelled-${Date.now()}`,
                        text,
                        unread: true,
                        type: 'order',
                        onClick: () => navigate('/admin/orders')
                    });
                    playNotificationSound();
                    showDesktopNotification('Order Cancelled', text);
                }
            }

            setLastOrdersState(currentOrdersState);
            return orderNotifications;
        } catch (error) {
            console.error('Error fetching order notifications:', error);
            return [];
        }
    };

    // Fetch low stock notifications
    const fetchLowStockNotifications = async () => {
        try {
            const lowStockAlertsEnabled = notificationSettings.settings.find(s => s.id === 'low_stock_alerts')?.value;
            if (!lowStockAlertsEnabled) {
                return [];
            }

            const response = await getDashboardStats();
            if (response.data && response.data.data) {
                const { lowStockItems = [] } = response.data.data;

                // Create notifications for low stock items
                return lowStockItems.map(item => ({
                    id: item._id,
                    text: `Low stock alert: ${item.name} (${item.stock} remaining)`,
                    unread: true,
                    type: 'low-stock',
                    onClick: () => navigate('/admin/menu')
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching low stock notifications:', error);
            return [];
        }
    };

    // Fetch all notifications
    const fetchAllNotifications = async () => {
        try {
            const [lowStockNotifications, orderNotifications] = await Promise.all([
                fetchLowStockNotifications(),
                fetchOrderNotifications()
            ]);

            const allNotifications = [...lowStockNotifications, ...orderNotifications];

            // Check if there are new notifications
            if (allNotifications.length > lastNotificationCount && lastNotificationCount !== 0) {
                playNotificationSound();

                // Show browser notification if permitted
                if (Notification.permission === 'granted') {
                    const newItems = allNotifications.slice(lastNotificationCount);
                    newItems.forEach(item => {
                        new Notification(item.type === 'low-stock' ? 'Low Stock Alert' : 'Order Update', {
                            body: item.text,
                            icon: '/favicon.ico'
                        });
                    });
                }
            }

            setLastNotificationCount(allNotifications.length);
            setNotifications(allNotifications);
            setHasUnread(allNotifications.some(n => n.unread));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchAllNotifications();
        // Refresh notifications every 2 seconds
        const interval = setInterval(fetchAllNotifications, 2000);

        // Add listener for immediate notification checks
        const handleCheckNotifications = () => {
            fetchAllNotifications();
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
                    {/* Left section with hamburger */}
                    <div className="flex items-center">
                        <motion.button
                            type="button"
                            className="p-2 rounded-md text-gray-500 hover:text-orange-600"
                            onClick={onToggleSidebar}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bars3Icon className="h-6 w-6 transition-transform duration-200 hover:rotate-180" />
                        </motion.button>
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
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </Menu.Item>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            No notifications
                                        </div>
                                    )}
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* User menu */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center gap-x-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                <span className="sr-only">Open user menu</span>
                                <UserCircleIcon className="h-8 w-8" />
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
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (
                                                item.href ? (
                                                    <Link
                                                        to={item.href}
                                                        className={classNames(
                                                            active ? 'bg-gray-50' : '',
                                                            'flex px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        {item.name}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={item.onClick}
                                                        className={classNames(
                                                            active ? 'bg-gray-50' : '',
                                                            'flex w-full px-4 py-2 text-sm text-gray-700'
                                                        )}
                                                    >
                                                        <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        {item.name}
                                                    </button>
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