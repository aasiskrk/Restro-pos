import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import logo from '../assets/frame.svg';
import { loginApi } from '../apis/api';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await loginApi(formData);
            console.log('Login response:', response.data);

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                const { role } = response.data.user;
                console.log('User role:', role);

                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });

                // Delay navigation to ensure toast is shown
                setTimeout(() => {
                    switch (role) {
                        case 'admin':
                            navigate('/admin', { replace: true });
                            break;
                        case 'server':
                            navigate('/server', { replace: true });
                            break;
                        case 'kitchen':
                            navigate('/kitchen', { replace: true });
                            break;
                        case 'cashier':
                            navigate('/cashier', { replace: true });
                            break;
                        default:
                            toast.error("Invalid role. Please contact administrator.", {
                                position: "top-right",
                                autoClose: 3000
                            });
                            setTimeout(() => navigate('/', { replace: true }), 1000);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            // Clear password field
            setFormData(prev => ({
                ...prev,
                password: ''
            }));

            // Handle specific error cases
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        toast.error(error.response.data.message || "Invalid email or password", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                        break;
                    case 403:
                        toast.error("You don't have permission to access this resource", {
                            position: "top-right",
                            autoClose: 3000
                        });
                        break;
                    case 404:
                        toast.error("User not found", {
                            position: "top-right",
                            autoClose: 3000
                        });
                        break;
                    default:
                        toast.error(error.response.data.message || "Login failed. Please try again.", {
                            position: "top-right",
                            autoClose: 3000
                        });
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection.", {
                    position: "top-right",
                    autoClose: 3000
                });
            } else {
                toast.error("An unexpected error occurred. Please try again.", {
                    position: "top-right",
                    autoClose: 3000
                });
            }
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
                                    <div className="relative mt-1">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
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