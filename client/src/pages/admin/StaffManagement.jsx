import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    ChevronDownIcon,
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
} from '@heroicons/react/24/outline';
import { UsersIcon as UsersIconSolid } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Input, Select } from '../../components/common/Form';
import DashboardLayout from '../../components/layout/DashboardLayout';

const staffStatusColors = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    'half-shift': 'bg-yellow-100 text-yellow-800',
    leave: 'bg-blue-100 text-blue-800',
};

const navigation = [
    { name: 'Dashboard', icon: ChartBarIcon, href: '/admin', current: false },
    { name: 'Staff Management', icon: UsersIconOutline, href: '/admin/staff', current: true },
    { name: 'Menu Management', icon: ClipboardDocumentListIcon, href: '/admin/menu', current: false },
    { name: 'Orders & Tables', icon: TableCellsIcon, href: '/admin/orders', current: false },
    { name: 'Inventory', icon: CubeIcon, href: '/admin/inventory', current: false },
    { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings', current: false },
];

export default function StaffManagement() {
    const [activeTab, setActiveTab] = useState('list');
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showViewStaff, setShowViewStaff] = useState(false);

    // Mock data
    const staffList = [
        {
            id: 'ST001',
            name: 'John Doe',
            role: 'Head Chef',
            email: 'john@example.com',
            age: 35,
            salary: '$4,500',
            timing: '9:00 AM - 5:00 PM',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        },
        // Add more staff members...
    ];

    const attendanceList = [
        {
            id: 'ST001',
            name: 'John Doe',
            role: 'Head Chef',
            date: '2024-03-15',
            timing: '9:00 AM - 5:00 PM',
            status: 'present',
        },
        {
            id: 'ST002',
            name: 'Jane Smith',
            role: 'Server',
            date: '2024-03-15',
            timing: '10:00 AM - 6:00 PM',
            status: 'absent',
        },
        {
            id: 'ST003',
            name: 'Mike Johnson',
            role: 'Sous Chef',
            date: '2024-03-15',
            timing: '8:00 AM - 4:00 PM',
            status: 'half-shift',
        },
        {
            id: 'ST004',
            name: 'Sarah Wilson',
            role: 'Hostess',
            date: '2024-03-15',
            timing: '11:00 AM - 7:00 PM',
            status: 'leave',
        },
    ];

    // Add form state
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        age: '',
        salary: '',
        timing: '',
        image: null,
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log(formData);
        setShowAddStaff(false);
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
                                            <img
                                                src={staff.image}
                                                alt={staff.name}
                                                className="h-32 w-32 rounded-full object-cover"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Name
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staff.name}</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">
                                                    Role
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">{staff.role}</p>
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
                                                <p className="mt-1 text-sm text-gray-900">{staff.salary}</p>
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
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAddStaff(true)}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add Staff
                        </motion.button>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="role">Sort by Role</option>
                            <option value="salary">Sort by Salary</option>
                        </select>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'list'
                            ? 'bg-orange-100 text-orange-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Staff List
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'attendance'
                            ? 'bg-orange-100 text-orange-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Attendance
                    </button>
                </div>

                {/* Staff List Table */}
                {activeTab === 'list' && (
                    <div className="mt-8 flex flex-col">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
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
                                                <tr key={staff.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                        <div className="flex items-center">
                                                            <img
                                                                className="h-10 w-10 rounded-full"
                                                                src={staff.image}
                                                                alt=""
                                                            />
                                                            <div className="ml-4">
                                                                <div className="font-medium text-gray-900">
                                                                    {staff.name}
                                                                </div>
                                                                <div className="text-gray-500">{staff.role}</div>
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
                                                        {staff.salary}
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
                                                            <button className="text-orange-600 hover:text-orange-900">
                                                                <PencilSquareIcon className="h-5 w-5" />
                                                            </button>
                                                            <button className="text-red-600 hover:text-red-900">
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
                        </div>
                    </div>
                )}

                {/* Attendance List */}
                {activeTab === 'attendance' && (
                    <div className="mt-8">
                        <div className="mt-4 flex flex-col">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                                        ID & Staff Details
                                                    </th>
                                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Date
                                                    </th>
                                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Timing
                                                    </th>
                                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {attendanceList.map((record) => (
                                                    <tr key={`${record.id}-${record.date}`}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <div className="font-medium text-gray-900">
                                                                        {record.name}
                                                                    </div>
                                                                    <div className="text-gray-500">{record.role}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.date}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {record.timing}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                            <div className="flex gap-2">
                                                                {Object.entries(staffStatusColors).map(([status, colorClass]) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                                                                            ${selectedStatus && selectedStatus !== status ? 'hidden' : ''} 
                                                                            ${status === record.status ? colorClass : 'bg-gray-100 text-gray-800'}
                                                                            transition-all duration-200 ease-in-out
                                                                            hover:ring-2 hover:ring-offset-1 hover:ring-orange-500
                                                                        `}
                                                                    >
                                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                        {status === record.status && selectedStatus === status && (
                                                                            <PencilSquareIcon
                                                                                className="h-3.5 w-3.5 ml-1.5 cursor-pointer"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    // Add your edit logic here
                                                                                    console.log('Edit status for:', record.id);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                                <h2 className="text-xl font-semibold text-gray-900">Add New Staff</h2>
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
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="space-y-5">
                                                    {/* Profile Photo Upload */}
                                                    <div className="flex flex-col items-center space-y-3">
                                                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                                                            {formData.image ? (
                                                                <img
                                                                    src={URL.createObjectURL(formData.image)}
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
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        image: file
                                                                    }));
                                                                }}
                                                            />
                                                        </label>
                                                    </div>

                                                    {/* Form Fields */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="col-span-2">
                                                            <Input
                                                                label="Full Name"
                                                                name="name"
                                                                value={formData.name}
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
                                                                <option value="Head Chef">Head Chef</option>
                                                                <option value="Sous Chef">Sous Chef</option>
                                                                <option value="Server">Server</option>
                                                                <option value="Hostess">Hostess</option>
                                                                <option value="Bartender">Bartender</option>
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
                                                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                >
                                                    Add Staff
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