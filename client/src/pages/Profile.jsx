import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    UserIcon,
    Cog6ToothIcon,
    ArrowLeftIcon,
    PencilIcon,
    ArrowRightOnRectangleIcon,
    KeyIcon,
    ClockIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUserApi, updateProfileApi, changePasswordApi, logout } from '../apis/api';

const profileNavigation = [
    { name: 'Profile', icon: UserIcon, href: '/profile' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/profile/settings' },
    { name: 'Logout', icon: ArrowRightOnRectangleIcon, href: '/logout' },
];

export default function Profile() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const location = useLocation();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        role: '',
        // Staff specific fields
        age: '',
        salary: '',
        timing: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Fetch user data
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            console.log('=== Profile Page Debug ===');
            console.log('Starting user data fetch...');

            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found in localStorage');
                toast.error('Please log in to access your profile');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }
            console.log('Token found:', token);

            const response = await getCurrentUserApi();
            console.log('API Response:', response);

            if (!response.data || !response.data.user) {
                console.error('Invalid response format:', response);
                toast.error('Invalid response format from server');
                setLoading(false);
                return;
            }

            const userData = response.data.user;
            console.log('User data received:', userData);

            // Check if user is staff based on the data structure
            const userIsStaff = userData.hasOwnProperty('age') && userData.hasOwnProperty('salary');
            console.log('Is staff user:', userIsStaff);
            setIsStaff(userIsStaff);

            setFormData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                location: userData.location || '',
                role: userData.role || '',
                // Set staff specific fields if available
                age: userData.age || '',
                salary: userData.salary || '',
                timing: userData.timing || '',
            });
            console.log('Form data set:', formData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response) {
                console.error('Error response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                });
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            console.error('Error stack:', error.stack);
            console.error('Error config:', error.config);

            const errorMessage = error.response?.data?.message || 'Failed to load user data';
            toast.error(errorMessage);
            setLoading(false);

            // If unauthorized, show message and delay redirect
            if (error.response?.status === 401) {
                console.log('Unauthorized access detected');
                toast.error('Session expired. Please log in again.');
                // Clear any stored auth data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Delay redirect to show the error message
                setTimeout(() => {
                    console.log('Redirecting to login page...');
                    navigate('/login');
                }, 2000);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateProfileApi(formData);
            setEditMode(false);
            toast.success('Profile updated successfully');
            fetchUserData();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleChangePassword = async () => {
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }

            await changePasswordApi({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setChangePasswordMode(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            toast.success('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm";

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 p-6 border-b border-gray-200">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                        </div>
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {profileNavigation.map((item) => (
                                    <li key={item.name}>
                                        {item.name === 'Logout' ? (
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 w-full"
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                            </button>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${item.name === 'Profile'
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                                    <UserIcon className="h-8 w-8 text-orange-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900">{formData.fullName}</h1>
                                    <p className="text-sm text-gray-500">{formData.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setChangePasswordMode(!changePasswordMode)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium"
                                >
                                    <KeyIcon className="h-4 w-4" />
                                    Change Password
                                </button>
                                {!isStaff && (
                                    <button
                                        onClick={() => editMode ? handleSave() : setEditMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium"
                                    >
                                        {editMode ? 'Save Changes' : (
                                            <>
                                                <PencilIcon className="h-4 w-4" />
                                                Edit Profile
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        disabled={!editMode || isStaff}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={true}
                                        className={inputClasses}
                                    />
                                </div>
                                {!isStaff && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                className={inputClasses}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Staff Information (only for staff users) */}
                        {isStaff && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Staff Information</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Age
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <span className="text-gray-900">{formData.age}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Salary
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{formData.salary}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Work Timing
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{formData.timing}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <div className="mt-1 flex items-center">
                                            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-gray-900 capitalize">{formData.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Role Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Role Information</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 w-fit px-3 py-1.5 rounded-lg">
                                    <UserIcon className="h-4 w-4" />
                                    <span className="text-sm font-medium capitalize">{formData.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        {changePasswordMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                            >
                                <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordInputChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordInputChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordInputChange}
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => {
                                                setChangePasswordMode(false);
                                                setPasswordData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: '',
                                                });
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleChangePassword}
                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 