import { useState, useEffect, Fragment, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dialog, Transition } from '@headlessui/react';
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
    UserCircleIcon,
    XMarkIcon,
    CameraIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUserApi, updateProfileApi, changePasswordApi, adminChangePasswordApi, updateProfilePictureApi, logout } from '../apis/api';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        role: '',
        profilePicture: '',
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

    const fileInputRef = useRef(null);

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
            const userIsStaff = userData.role === 'server' || userData.role === 'kitchen' || userData.role === 'cashier';
            console.log('Is staff user:', userIsStaff);
            setIsStaff(userIsStaff);

            // Handle profile picture URL
            let profilePicture = userData.profilePicture;
            if (profilePicture && !profilePicture.startsWith('http')) {
                // Use a consistent base URL for development
                profilePicture = `http://localhost:5000${profilePicture}`;
            }
            console.log('Profile picture URL:', profilePicture);

            setFormData({
                ...userData,
                profilePicture,
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

    const handleProfilePictureUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image file (JPEG, PNG)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await updateProfilePictureApi(formData, isStaff);
            console.log('Profile picture update response:', response);
            
            if (response.data?.data?.profilePicture) {
                // Update localStorage with new profile picture URL
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    const profilePicture = response.data.data.profilePicture;
                    
                    // Store the relative path in localStorage
                    userData.profilePicture = profilePicture;
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    // Trigger storage event manually since we're in the same window
                    window.dispatchEvent(new Event('storage'));
                }

                toast.success('Profile picture updated successfully');
                fetchUserData(); // Refresh user data to get new profile picture
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile picture');
        }
    };

    const handleChangePassword = async () => {
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }

            setIsSubmitting(true);
            // Use the same API endpoint for both admin and staff
            await changePasswordApi({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            setChangePasswordMode(false);
            resetPasswordFields();
            toast.success('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetPasswordFields = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
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
            {/* Change Password Modal */}
            <Transition.Root show={changePasswordMode} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => {
                        setChangePasswordMode(false);
                        resetPasswordFields();
                    }}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div className="absolute right-0 top-0 pr-4 pt-4">
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={() => {
                                                setChangePasswordMode(false);
                                                resetPasswordFields();
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                                Change Password
                                            </Dialog.Title>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Ensure your account is using a secure password
                                            </p>
                                            <div className="mt-6 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordInputChange}
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordInputChange}
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordInputChange}
                                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                                        <button
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={isSubmitting}
                                            className="inline-flex w-full justify-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                                        >
                                            {isSubmitting ? 'Changing...' : 'Change Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setChangePasswordMode(false);
                                                resetPasswordFields();
                                            }}
                                            className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

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
                                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${location.pathname === item.href
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
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg">
                                            {formData.profilePicture ? (
                                                <img
                                                    className="h-full w-full object-cover"
                                                    src={formData.profilePicture}
                                                    alt={formData.fullName}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = '<div class="flex h-full w-full items-center justify-center"><svg class="h-14 w-14 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg></div>';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <UserCircleIcon className="h-14 w-14 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            <CameraIcon className="h-5 w-5 text-gray-600" />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={handleProfilePictureUpload}
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{formData.fullName}</h1>
                                        <p className="text-sm text-gray-500 mb-3">{formData.email}</p>
                                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 w-fit px-3 py-1.5 rounded-lg">
                                            <UserIcon className="h-4 w-4" />
                                            <span className="text-sm font-medium capitalize">{formData.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setChangePasswordMode(!changePasswordMode)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium transition-colors duration-200"
                                    >
                                        <KeyIcon className="h-4 w-4" />
                                        Change Password
                                    </button>
                                    {!isStaff && (
                                        <button
                                            onClick={() => editMode ? handleSave() : setEditMode(true)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium transition-colors duration-200"
                                        >
                                            {editMode ? (
                                                <>Save Changes</>
                                            ) : (
                                                <>
                                                    <PencilIcon className="h-4 w-4" />
                                                    Edit Profile
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        disabled={!editMode || isStaff}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${!editMode || isStaff ? 'bg-gray-50' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={true}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm bg-gray-50"
                                    />
                                </div>
                                {!isStaff && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${!editMode ? 'bg-gray-50' : ''}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${!editMode ? 'bg-gray-50' : ''}`}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Staff Information (only for staff users) */}
                        {isStaff && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium text-gray-900">Staff Information</h2>
                                    <p className="text-sm text-gray-500 mt-1">Your employment details and work information</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Age
                                        </label>
                                        <div className="mt-1 flex items-center rounded-lg bg-gray-50 px-4 py-3">
                                            <span className="text-gray-900">{formData.age}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Salary
                                        </label>
                                        <div className="mt-1 flex items-center rounded-lg bg-gray-50 px-4 py-3">
                                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{formData.salary}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Work Timing
                                        </label>
                                        <div className="mt-1 flex items-center rounded-lg bg-gray-50 px-4 py-3">
                                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{formData.timing}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Department
                                        </label>
                                        <div className="mt-1 flex items-center rounded-lg bg-gray-50 px-4 py-3">
                                            <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-gray-900 capitalize">{formData.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 