import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import logo from '../assets/frame.svg';
import { loginApi } from '../apis/api';
import { toast } from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'admin'
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
            const response = await loginApi(formData);

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success("Login successful!");

                // Navigate based on role
                switch (response.data.user.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'server':
                        navigate('/server');
                        break;
                    case 'kitchen':
                        navigate('/kitchen');
                        break;
                    case 'cashier':
                        navigate('/cashier');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || "Login failed");
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
                                <h2 className="mt-2 text-xl font-semibold text-gray-900">Welcome Back</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
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
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
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
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Logging in...' : 'Log In'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 space-y-4 text-center">
                                <div>
                                    <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-500">
                                        Forgot your password?
                                    </Link>
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