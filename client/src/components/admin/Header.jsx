import { useState, Fragment } from 'react';
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

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header({ onToggleSidebar }) {
    const [notifications] = useState([
        { id: 1, text: 'New order #123 received', unread: true },
        { id: 2, text: 'Low stock alert: Chicken Wings', unread: true },
        { id: 3, text: 'Staff schedule updated', unread: false },
    ]);

    const userNavigation = [
        { name: 'Profile', href: '#', icon: UserCircleIcon },
        { name: 'Settings', href: '#', icon: Cog6ToothIcon },
        { name: 'Sign out', href: '#', icon: ArrowRightOnRectangleIcon },
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
                                <Menu.Button className="relative flex rounded-full p-1.5 text-gray-400 hover:text-orange-500">
                                    {notifications.some(n => n.unread) ? (
                                        <BellIconSolid className="h-6 w-6 text-orange-500" />
                                    ) : (
                                        <BellIcon className="h-6 w-6" />
                                    )}
                                    {notifications.some(n => n.unread) && (
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
                                    {notifications.map((notification) => (
                                        <Menu.Item key={notification.id}>
                                            {({ active }) => (
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className={classNames(
                                                        active ? 'bg-gray-50' : '',
                                                        'px-4 py-2 cursor-pointer'
                                                    )}
                                                >
                                                    <p className={`text-sm ${notification.unread ? 'font-medium' : ''}`}>
                                                        {notification.text}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </Menu.Item>
                                    ))}
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
                                                <motion.a
                                                    href={item.href}
                                                    className={classNames(
                                                        active ? 'bg-gray-50' : '',
                                                        'block px-4 py-2 text-sm text-gray-700'
                                                    )}
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className="flex items-center">
                                                        <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                                                        {item.name}
                                                    </div>
                                                </motion.a>
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