import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import BackButton from '../components/common/BackButton';
import logo from '../assets/frame.svg';
import { registerApi } from '../apis/api';
import { toast } from 'react-hot-toast';

export default function Signup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        restaurantName: '',
        ownerName: '',
        size: '',
        type: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: ''
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Validate all fields are filled
        const requiredFields = ['restaurantName', 'ownerName', 'size', 'type', 'phone', 'email', 'password', 'address'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsLoading(true);
            const response = await registerApi({
                restaurantName: formData.restaurantName,
                ownerName: formData.ownerName,
                size: formData.size,
                type: formData.type,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                address: formData.address
            });

            if (response.data.success) {
                toast.success("Restaurant registration successful!");
                // Navigate to admin setup with restaurant data and credentials
                navigate('/admin-setup', {
                    state: {
                        restaurantData: {
                            ...response.data.restaurant,
                            password: formData.password // Pass the password to admin setup
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

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

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                                        Restaurant Name
                                    </label>
                                    <input
                                        type="text"
                                        id="restaurantName"
                                        name="restaurantName"
                                        value={formData.restaurantName}
                                        onChange={handleChange}
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
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
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
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        value={formData.password}
                                        onChange={handleChange}
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
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Registering...' : 'Register Restaurant'}
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