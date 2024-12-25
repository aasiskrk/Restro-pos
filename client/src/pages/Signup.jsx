import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import BackButton from '../components/common/BackButton';
import logo from '../assets/frame.svg';

export default function Signup() {
    const [formData, setFormData] = useState({
        restaurantName: '',
        ownerName: '',
        size: '',
        type: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const restaurantSizes = [
        { value: 'small', label: 'Small (up to 50 seats)' },
        { value: 'medium', label: 'Medium (51-150 seats)' },
        { value: 'large', label: 'Large (151-300 seats)' },
        { value: 'xlarge', label: 'Extra Large (300+ seats)' }
    ];

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

    return (
        <div className="min-h-screen bg-orange-600 flex">
            {/* Left side with illustration */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                <img
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                    alt="Restaurant management"
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
                                <h2 className="mt-2 text-xl font-semibold text-gray-900">Register Your Restaurant</h2>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                                        Restaurant Name
                                    </label>
                                    <input
                                        type="text"
                                        id="restaurantName"
                                        name="restaurantName"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                                        Owner Name
                                    </label>
                                    <input
                                        type="text"
                                        id="ownerName"
                                        name="ownerName"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                            Restaurant Type
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                            required
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
                                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                                            Restaurant Size
                                        </label>
                                        <select
                                            id="size"
                                            name="size"
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Select Size</option>
                                            {restaurantSizes.map(size => (
                                                <option key={size.value} value={size.value}>
                                                    {size.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
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
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    >
                                        Register Restaurant
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                                    Log in
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 