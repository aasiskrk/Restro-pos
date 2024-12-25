import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import BackButton from '../components/common/BackButton';
import logo from '../assets/frame.svg';

export default function Login() {
    const [role, setRole] = useState('server');

    return (
        <div className="min-h-screen bg-orange-600 flex">
            {/* Left side with illustration */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                    alt="Restaurant staff working"
                    className="max-w-md w-full rounded-2xl object-cover shadow-2xl"
                />
            </div>

            {/* Right side with form */}
            <div className="w-full lg:w-1/2 flex flex-col">
                <div className="absolute top-4 left-4 z-10">
                    <BackButton />
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white shadow-xl rounded-2xl p-8"
                        >
                            <div className="text-center mb-8">
                                <Link to="/" className="inline-block">
                                    <div className="flex items-center justify-center gap-2">
                                        <img
                                            src={logo}
                                            alt="DineTrack Logo"
                                            className="h-8 w-8 object-contain"
                                        />
                                        <span className="text-2xl font-bold text-orange-600">DineTrack</span>
                                    </div>
                                </Link>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="server">Server</option>
                                        <option value="kitchen">Kitchen Staff</option>
                                        <option value="cashier">Cashier</option>
                                    </select>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Log In
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 space-y-4 text-center">
                                <div>
                                    <a href="#" className="text-sm text-orange-600 hover:text-orange-500">
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-medium text-orange-600 hover:text-orange-500">
                                        Sign up now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 