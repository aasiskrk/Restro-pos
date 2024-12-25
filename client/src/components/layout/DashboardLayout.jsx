import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../admin/Header';
import { motion } from 'framer-motion';
import logo from '../../assets/frame.svg';

export default function DashboardLayout({ children, navigation }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex min-h-screen">
                {/* Sidebar with transition */}
                <div
                    className={`${isSidebarOpen ? 'w-64' : 'w-20'
                        } hidden md:flex md:flex-col transition-all duration-300 ease-in-out`}
                >
                    <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
                        <div className="flex flex-shrink-0 items-center justify-center px-4">
                            <Link to="/">
                                {isSidebarOpen ? (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={logo}
                                            alt="DineTrack Logo"
                                            className="h-8 w-8 object-contain"
                                        />
                                        <span className="text-2xl font-bold text-orange-600">DineTrack</span>
                                    </div>
                                ) : (
                                    <img
                                        src={logo}
                                        alt="DineTrack Logo"
                                        className="h-8 w-8 object-contain"
                                    />
                                )}
                            </Link>
                        </div>
                        <div className="mt-5 flex flex-grow flex-col">
                            <nav className="flex-1 space-y-1 px-2 pb-4">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`
                                                group flex items-center rounded-md px-2 py-2 text-sm font-medium
                                                ${isActive
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }
                                                ${!isSidebarOpen && 'justify-center'}
                                            `}
                                            title={!isSidebarOpen ? item.name : ''}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <item.icon
                                                    className={`h-6 w-6 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-500'
                                                        }`}
                                                    aria-hidden="true"
                                                />
                                            </motion.div>
                                            {isSidebarOpen && (
                                                <span className="ml-3 transition-opacity duration-300">
                                                    {item.name}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex flex-1 flex-col">
                    <Header onToggleSidebar={toggleSidebar} />
                    <main className="flex-1 p-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
} 