import { useState, Fragment, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    PlusIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    ChartBarIcon,
    UsersIcon as UsersIconOutline,
    ClipboardDocumentListIcon,
    TableCellsIcon,
    CubeIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { UsersIcon as UsersIconSolid } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Input, Select, Button } from '../../components/common/Form';
import DashboardLayout from '../../components/admin/DashboardLayout';
import * as api from '../../apis/api';

const staffStatusColors = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    'half-shift': 'bg-yellow-100 text-yellow-800',
    leave: 'bg-blue-100 text-blue-800',
    'off-work': 'bg-gray-100 text-gray-800'
};

const staffRoles = {
    server: 'Server',
    kitchen: 'Kitchen Staff',
    cashier: 'Cashier'
};

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIconOutline, href: '/admin/staff', current: true },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Inventory', icon: CubeIcon, href: '/admin/inventory', current: false },
    { name: 'Audit Logs', icon: ClipboardDocumentListIcon, href: '/admin/audit-logs', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

export default function StaffManagement() {
    const [activeTab, setActiveTab] = useState('list');
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showViewStaff, setShowViewStaff] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [staffHistory, setStaffHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [error, setError] = useState(null);
    const [editingStatusId, setEditingStatusId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        role: '',
        email: '',
        password: '',
        age: '',
        salary: '',
        timing: '',
        profilePicture: null,
    });

    // Fetch staff list
    useEffect(() => {
        fetchStaffList();
    }, []);

    // Fetch attendance data when tab changes
    useEffect(() => {
        if (activeTab === 'attendance') {
            fetchAttendanceHistory();
        } else if (activeTab === 'history') {
            fetchClockHistory();
        }
    }, [activeTab]);

    const fetchStaffList = async () => {
        try {
            setIsLoading(true);
            const response = await api.getAllStaff();
            setStaffList(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching staff list');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendanceHistory = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.getAttendanceHistory();
            console.log('Attendance data:', response.data); // For debugging
            if (Array.isArray(response.data)) {
                setAttendanceList(response.data);
            } else if (response.data.data && Array.isArray(response.data.data)) {
                setAttendanceList(response.data.data);
            } else {
                setAttendanceList([]);
                console.error('Unexpected attendance data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
            setError('Error fetching attendance data');
            toast.error('Error fetching attendance data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClockHistory = async () => {
        try {
            setIsLoading(true);
            const response = await api.getAttendanceHistory({
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
                endDate: new Date().toISOString()
            });
            setStaffHistory(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching clock history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePicture: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            console.log('Form submission started');

            // Validate required fields
            const requiredFields = ['fullName', 'email', 'role', 'age', 'salary', 'timing'];
            if (!isEditing) requiredFields.push('password');
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0) {
                console.log('Missing fields:', missingFields);
                toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return;
            }

            const formDataToSend = new FormData();

            // Append all form data
            Object.keys(formData).forEach(key => {
                if (key === 'age' || key === 'salary') {
                    // Convert to numbers
                    formDataToSend.append(key, Number(formData[key]));
                } else if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            console.log('Sending form data:', Object.fromEntries(formDataToSend));
            let response;
            if (isEditing) {
                response = await api.updateStaff(editingStaff._id, formDataToSend);
                toast.success('Staff updated successfully');
            } else {
                response = await api.createStaff(formDataToSend);
                toast.success('Staff created successfully');
            }
            console.log('Server response:', response);

            setShowAddStaff(false);
            fetchStaffList();

            // Reset form and editing state
            setFormData({
                fullName: '',
                role: '',
                email: '',
                password: '',
                age: '',
                salary: '',
                timing: '',
                profilePicture: null
            });
            setIsEditing(false);
            setEditingStaff(null);
        } catch (error) {
            console.error('Error saving staff:', error);
            toast.error(error.response?.data?.message || `Error ${isEditing ? 'updating' : 'creating'} staff`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteStaff = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone and will delete all attendance records for this staff member.')) {
            try {
                setIsLoading(true);
                await api.deleteStaff(id);
                toast.success('Staff member and related records deleted successfully');

                // Remove the staff from local state
                setStaffList(prevList => prevList.filter(staff => staff._id !== id));

                // Remove related attendance records from local state
                setAttendanceList(prevList => prevList.filter(record => record.staff._id !== id));
                setStaffHistory(prevList => prevList.filter(record => record.staff._id !== id));
            } catch (error) {
                console.error('Error deleting staff:', error);
                toast.error(error.response?.data?.message || 'Error deleting staff member');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateAttendanceStatus = async (staffId, status) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.updateAttendanceStatus(staffId, status);

            // Update the local attendance list
            setAttendanceList(prevList => {
                const newList = [...prevList];
                const index = newList.findIndex(a => a.staff?._id === staffId);
                if (index !== -1) {
                    newList[index] = response.data;
                } else {
                    newList.push(response.data);
                }
                return newList;
            });

            toast.success('Attendance status updated');
            setEditingStatusId(null); // Close edit mode after update
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Error updating attendance status');
            toast.error(error.response?.data?.message || 'Error updating attendance status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockIn = async (staffId) => {
        try {
            setIsLoading(true);
            const now = new Date();
            await api.clockIn(staffId);
            toast.success(`Clocked in at ${now.toLocaleTimeString()}`);
            fetchAttendanceHistory();
        } catch (error) {
            console.error('Error clocking in:', error);
            toast.error(error.response?.data?.message || 'Error clocking in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClockOut = async (staffId) => {
        if (window.confirm('Are you sure you want to clock out this staff member?')) {
            try {
                setIsLoading(true);
                const now = new Date();
                await api.clockOut(staffId);
                toast.success(`Clocked out at ${now.toLocaleTimeString()}`);
                fetchAttendanceHistory();
            } catch (error) {
                console.error('Error clocking out:', error);
                toast.error(error.response?.data?.message || 'Error clocking out');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEditStaff = (staff) => {
        setEditingStaff(staff);
        setFormData({
            fullName: staff.fullName,
            role: staff.role,
            email: staff.email,
            age: staff.age,
            salary: staff.salary,
            timing: staff.timing,
            profilePicture: null
        });
        setIsEditing(true);
        setShowAddStaff(true);
    };

    const ViewStaffModal = ({ staff, isOpen, onClose }) => {
        if (!staff) return null;

        return (
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex items-center justify-between mb-6">
                                        <Dialog.Title className="text-lg font-medium text-gray-900">
                                            Staff Details
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="rounded-full p-1 hover:bg-gray-100"
                                        >
                                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <div className="h-32 w-32 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                                                {staff.profilePicture ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}${staff.profilePicture}`}
                                                        alt={staff.fullName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <UserCircleIcon className="h-20 w-20 text-orange-600" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Name
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staff.fullName}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Role
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staffRoles[staff.role]}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Email
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staff.email}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Age
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staff.age}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Salary
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">${staff.salary}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Timing
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staff.timing}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <UsersIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Total Staff: <span className="font-medium">{staffList.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Button onClick={() => setShowAddStaff(true)}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Staff
                        </Button>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="flex gap-4" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`${activeTab === 'list'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                        >
                            Staff List
                        </button>
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className={`${activeTab === 'attendance'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                        >
                            Attendance
                        </button>
                    </nav>
                </div>

                {/* Staff List Table */}
                {activeTab === 'list' && (
                    <div className="mt-8">
                        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                            ID & Staff Details
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Email
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Age
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Salary
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Timing
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {staffList.map((staff) => (
                                        <tr key={staff._id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                                                        {staff.profilePicture ? (
                                                            <img
                                                                src={`${import.meta.env.VITE_API_URL}${staff.profilePicture}`}
                                                                alt={staff.fullName}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserCircleIcon className="h-6 w-6 text-orange-600" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">
                                                            {staff.fullName}
                                                        </div>
                                                        <div className="text-gray-500">{staffRoles[staff.role]}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {staff.email}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {staff.age}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                ${staff.salary}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {staff.timing}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        onClick={() => {
                                                            setSelectedStaff(staff);
                                                            setShowViewStaff(true);
                                                        }}
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="text-orange-600 hover:text-orange-900"
                                                        onClick={() => handleEditStaff(staff)}
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDeleteStaff(staff._id)}
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Attendance List */}
                {activeTab === 'attendance' && (
                    <div className="mt-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-600">{error}</div>
                        ) : (
                            <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Staff Details
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Date
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {staffList.map((staff) => {
                                            const attendance = attendanceList.find(a => a.staff?._id === staff._id);
                                            const currentStatus = attendance?.status;
                                            const isEditing = editingStatusId === staff._id;

                                            return (
                                                <tr key={staff._id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                                                                {staff.profilePicture ? (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_API_URL}${staff.profilePicture}`}
                                                                        alt={staff.fullName}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <UserCircleIcon className="h-6 w-6 text-orange-600" />
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="font-medium text-gray-900">
                                                                    {staff.fullName}
                                                                </div>
                                                                <div className="text-gray-500">{staffRoles[staff.role]}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {new Date().toLocaleDateString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                        <div className="flex gap-2 items-center">
                                                            {editingStatusId === staff._id ? (
                                                                // Show all status options when editing
                                                                Object.entries(staffStatusColors).map(([status, colorClass]) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => {
                                                                            handleUpdateAttendanceStatus(staff._id, status);
                                                                            setEditingStatusId(null);
                                                                        }}
                                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                                                                            ${attendance?.status === status ? colorClass : 'bg-gray-100 text-gray-800'}
                                                                            transition-all duration-200 ease-in-out
                                                                            hover:ring-2 hover:ring-offset-1 hover:ring-orange-500
                                                                        `}
                                                                        disabled={isLoading}
                                                                    >
                                                                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                // Show current status with edit button
                                                                <>
                                                                    <span
                                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                                                                            ${attendance?.status ? staffStatusColors[attendance.status] : 'bg-gray-100 text-gray-800'}`
                                                                        }
                                                                    >
                                                                        {attendance?.status ?
                                                                            attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1).replace('-', ' ')
                                                                            : 'Not Set'
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setEditingStatusId(staff._id)}
                                                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                                        disabled={isLoading}
                                                                    >
                                                                        <PencilSquareIcon className="h-4 w-4 text-gray-500" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Add Staff Slide-over Panel */}
                <AnimatePresence>
                    {showAddStaff && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                                aria-hidden="true"
                                onClick={() => setShowAddStaff(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ type: "spring", damping: 20 }}
                                className="fixed inset-y-0 right-0 flex max-w-md w-full z-50"
                            >
                                <div className="relative flex-1 h-full bg-white shadow-xl rounded-l-2xl overflow-hidden">
                                    <div className="h-full flex flex-col">
                                        {/* Header */}
                                        <div className="px-6 py-5 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-semibold text-gray-900">
                                                    {isEditing ? 'Edit Staff' : 'Add New Staff'}
                                                </h2>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setShowAddStaff(false)}
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                                >
                                                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Form Content */}
                                        <div className="flex-1 overflow-y-auto p-6">
                                            <form id="addStaffForm" onSubmit={handleSubmit} className="space-y-6">
                                                <div className="space-y-5">
                                                    {/* Profile Photo Upload */}
                                                    <div className="flex flex-col items-center space-y-3">
                                                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                                            {formData.profilePicture ? (
                                                                <img
                                                                    src={URL.createObjectURL(formData.profilePicture)}
                                                                    alt="Preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <UserCircleIcon className="h-16 w-16 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <label className="cursor-pointer">
                                                            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
                                                                <PlusIcon className="h-4 w-4" />
                                                                Upload Photo
                                                            </span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                    </div>

                                                    {/* Form Fields */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="col-span-2">
                                                            <Input
                                                                label="Full Name"
                                                                name="fullName"
                                                                value={formData.fullName}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Select
                                                                label="Role"
                                                                name="role"
                                                                value={formData.role}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                <option value="">Select Role</option>
                                                                {Object.entries(staffRoles).map(([value, label]) => (
                                                                    <option key={value} value={value}>
                                                                        {label}
                                                                    </option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                type="email"
                                                                label="Email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Input
                                                                type="number"
                                                                label="Age"
                                                                name="age"
                                                                value={formData.age}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Input
                                                                label="Salary"
                                                                name="salary"
                                                                value={formData.salary}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                label="Timing"
                                                                name="timing"
                                                                value={formData.timing}
                                                                onChange={handleInputChange}
                                                                placeholder="e.g., 9:00 AM - 5:00 PM"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                type="password"
                                                                label="Password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleInputChange}
                                                                required
                                                                minLength={6}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        {/* Footer */}
                                        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                                            <div className="flex justify-end gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="button"
                                                    onClick={() => setShowAddStaff(false)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                >
                                                    Cancel
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    form="addStaffForm"
                                                    disabled={isLoading}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Staff' : 'Add Staff')}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <ViewStaffModal
                    staff={selectedStaff}
                    isOpen={showViewStaff}
                    onClose={() => {
                        setShowViewStaff(false);
                        setSelectedStaff(null);
                    }}
                />
            </div>
        </DashboardLayout>
    );
} 