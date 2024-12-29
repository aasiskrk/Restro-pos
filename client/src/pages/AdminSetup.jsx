import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { setupAdminApi } from '../apis/api';
import logo from '../assets/frame.svg';

export default function AdminSetup() {
    const navigate = useNavigate();
    const location = useLocation();
    const restaurantData = location.state?.restaurantData;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: restaurantData?.email || '',
        phone: restaurantData?.phone || '',
        password: restaurantData?.password || '',
        location: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            console.log('Sending admin setup data:', {
                ...formData,
                restaurantId: restaurantData.id
            });
            const response = await setupAdminApi({
                ...formData,
                restaurantId: restaurantData.id
            });

            if (response.data.success) {
                toast.success("Admin setup successful!");
                navigate('/login');
            }
        } catch (error) {
            console.error('Admin setup error:', error);
            console.log('Error response:', error.response);
            console.log('Error request:', error.config);
            toast.error(error.response?.data?.message || "Admin setup failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!restaurantData) {
        navigate('/signup');
        return null;
    }

    return (
        <div className="min-h-screen bg-orange-600 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-xl rounded-2xl p-8"
                >
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2">
                            <img
                                src={logo}
                                alt="DineTrack Logo"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="text-2xl font-bold text-orange-600">DineTrack</span>
                        </div>
                        <h2 className="mt-2 text-xl font-semibold text-gray-900">Setup Admin Account</h2>
                        <p className="mt-1 text-sm text-gray-600">Complete your admin profile for {restaurantData.restaurantName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
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
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm bg-gray-100"
                                required
                                readOnly
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
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm bg-gray-100"
                                required
                                readOnly
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter your location"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Setting up...' : 'Complete Setup'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
} 