import { useState, Fragment, useRef, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    BellIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getDashboardStats, getActiveOrders, getAllOrders, getAllPayments } from '../../apis/api';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header({ onToggleSidebar }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                console.log('Parsed user data:', parsedUser); // Debug log

                // For staff roles (server, kitchen, cashier), the data structure is different
                if (parsedUser.role !== 'admin') {
                    // Check all possible profile picture fields
                    const profilePic = parsedUser.profilePicture ||
                        parsedUser.image ||
                        parsedUser.profileImage ||
                        parsedUser.avatar;

                    // If profile picture exists, ensure it has the full URL
                    const fullProfilePic = profilePic ?
                        (profilePic.startsWith('http') ? profilePic : `http://localhost:5000/staff/${profilePic}`) :
                        null;

                    console.log('Staff profile picture:', fullProfilePic); // Debug log

                    return {
                        ...parsedUser,
                        fullName: parsedUser.fullName || parsedUser.name,
                        profilePicture: fullProfilePic
                    };
                }

                // For admin, check if profile picture needs full URL
                if (parsedUser.profilePicture && !parsedUser.profilePicture.startsWith('http')) {
                    parsedUser.profilePicture = `http://localhost:5000${parsedUser.profilePicture}`;
                }

                console.log('Admin profile picture:', parsedUser.profilePicture); // Debug log
                return parsedUser;
            }
            return null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    });

    // Function to get role-specific notifications
    const fetchRoleBasedNotifications = async () => {
        try {
            const roleNotifications = [];

            // Common function to add notification
            const addNotification = (text, type, onClick) => {
                roleNotifications.push({
                    id: `${type}-${Date.now()}-${Math.random()}`,
                    text,
                    type,
                    unread: true,
                    onClick
                });
            };

            // Admin notifications
            if (user?.role === 'admin') {
                const [activeOrdersRes, allOrdersRes, dashboardStats, paymentsRes] = await Promise.all([
                    getActiveOrders(),
                    getAllOrders(),
                    getDashboardStats(),
                    getAllPayments()
                ]);

                const activeOrders = activeOrdersRes.data.orders || [];
                const pendingOrders = activeOrders.filter(order => order.status === 'pending');
                const lowStockItems = dashboardStats.data?.data?.lowStockItems || [];
                const pendingPayments = paymentsRes.data?.payments?.filter(p => p.status === 'pending') || [];

                if (pendingOrders.length > 0) {
                    addNotification(`${pendingOrders.length} pending orders`, 'order', () => navigate('/admin/orders'));
                }
                if (lowStockItems.length > 0) {
                    addNotification(`${lowStockItems.length} items low in stock`, 'inventory', () => navigate('/admin/inventory'));
                }
                if (pendingPayments.length > 0) {
                    addNotification(`${pendingPayments.length} pending payments`, 'payment', () => navigate('/admin/payments'));
                }
            }

            // Server notifications
            else if (user?.role === 'server') {
                const activeOrdersRes = await getActiveOrders();
                const activeOrders = activeOrdersRes.data.orders || [];
                const readyOrders = activeOrders.filter(order => order.status === 'ready');

                if (readyOrders.length > 0) {
                    addNotification(`${readyOrders.length} orders ready to serve`, 'order', () => navigate('/server/orders'));
                }
            }

            // Kitchen staff notifications
            else if (user?.role === 'kitchen') {
                const [activeOrdersRes, dashboardStats] = await Promise.all([
                    getActiveOrders(),
                    getDashboardStats()
                ]);

                const activeOrders = activeOrdersRes.data.orders || [];
                const pendingOrders = activeOrders.filter(order => order.status === 'pending');
                const lowStockItems = dashboardStats.data?.data?.lowStockItems || [];

                if (pendingOrders.length > 0) {
                    addNotification(`${pendingOrders.length} orders to prepare`, 'order', () => navigate('/kitchen/orders'));
                }
                if (lowStockItems.length > 0) {
                    addNotification(`${lowStockItems.length} items low in stock`, 'inventory', () => navigate('/kitchen/inventory'));
                }
            }

            // Cashier notifications
            else if (user?.role === 'cashier') {
                const paymentsRes = await getAllPayments();
                const pendingPayments = paymentsRes.data?.payments?.filter(p => p.status === 'pending') || [];

                if (pendingPayments.length > 0) {
                    addNotification(`${pendingPayments.length} pending payments`, 'payment', () => navigate('/cashier/payments'));
                }
            }

            setNotifications(roleNotifications);
            setHasUnread(roleNotifications.length > 0 && !isDropdownOpen);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchRoleBasedNotifications();
        const interval = setInterval(fetchRoleBasedNotifications, 30000); // Fetch every 30 seconds
        return () => clearInterval(interval);
    }, [user, isDropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const markAsRead = (notification) => {
        if (notification.onClick) {
            notification.onClick();
        }
        setIsDropdownOpen(false);
    };

    const getNotificationIcon = (type) => {
        const iconClasses = 'h-5 w-5';
        switch (type) {
            case 'order':
                return <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>;
            case 'inventory':
                return <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>;
            case 'payment':
                return <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>;
            default:
                return null;
        }
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left section */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            type="button"
                            className="p-2 rounded-md text-gray-500 hover:text-orange-600"
                            onClick={onToggleSidebar}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </motion.button>

                        {/* Role display */}
                        {user?.role && (
                            <span className="text-sm font-medium text-gray-600">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        )}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Menu as="div" className="relative">
                            {({ open }) => {
                                if (open !== isDropdownOpen) {
                                    setIsDropdownOpen(open);
                                }
                                return (
                                    <>
                                        <Menu.Button className="relative p-2 text-gray-400 hover:text-orange-500 rounded-full hover:bg-gray-100">
                                            <span className="sr-only">View notifications</span>
                                            {hasUnread ? (
                                                <BellIconSolid className="h-6 w-6 text-orange-500" />
                                            ) : (
                                                <BellIcon className="h-6 w-6" />
                                            )}
                                            {hasUnread && (
                                                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
                                            )}
                                        </Menu.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-100"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items
                                                static
                                                className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                            >
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification) => (
                                                        <Menu.Item key={notification.id}>
                                                            {({ active }) => (
                                                                <button
                                                                    className={classNames(
                                                                        active ? 'bg-gray-50' : '',
                                                                        'w-full px-4 py-3 flex items-start space-x-3'
                                                                    )}
                                                                    onClick={() => markAsRead(notification)}
                                                                >
                                                                    <span className={`flex-shrink-0 text-${notification.type === 'payment' ? 'green' : notification.type === 'inventory' ? 'yellow' : 'orange'}-500`}>
                                                                        {getNotificationIcon(notification.type)}
                                                                    </span>
                                                                    <p className="text-sm text-gray-900">
                                                                        {notification.text}
                                                                    </p>
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500">
                                                        No new notifications
                                                    </div>
                                                )}
                                            </Menu.Items>
                                        </Transition>
                                    </>
                                );
                            }}
                        </Menu>

                        {/* User menu */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-3 rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full overflow-hidden">
                                    {user?.profilePicture ? (
                                        <img
                                            className="h-full w-full object-cover"
                                            src={user.profilePicture}
                                            alt={user?.fullName}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<svg class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                            <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {user?.fullName && (
                                    <div className="hidden md:flex md:items-center md:space-x-1">
                                        <span className="text-sm font-medium">{user.fullName}</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
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
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'flex px-4 py-2 text-sm text-gray-700'
                                                )}
                                            >
                                                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile/settings"
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'flex px-4 py-2 text-sm text-gray-700'
                                                )}
                                            >
                                                <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                Settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'flex w-full px-4 py-2 text-sm text-gray-700'
                                                )}
                                            >
                                                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </header>
    );
} 