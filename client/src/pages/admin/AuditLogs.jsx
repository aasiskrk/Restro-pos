import { useState } from 'react';
import {
    ClipboardDocumentListIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    UserIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/admin/DashboardLayout';

// Mock audit log data
const mockAuditLogs = [
    {
        id: 1,
        user: 'John Smith',
        role: 'Server',
        action: 'Created new order',
        details: 'Order #1234 for Table 3',
        timestamp: '2024-01-20 14:30:45',
        ipAddress: '192.168.1.100'
    },
    {
        id: 2,
        user: 'Sarah Johnson',
        role: 'Cashier',
        action: 'Processed payment',
        details: 'Payment of $45.99 for Order #1234',
        timestamp: '2024-01-20 14:35:22',
        ipAddress: '192.168.1.101'
    },
    {
        id: 3,
        user: 'Mike Wilson',
        role: 'Kitchen Staff',
        action: 'Updated order status',
        details: 'Marked Order #1234 items as ready',
        timestamp: '2024-01-20 14:40:15',
        ipAddress: '192.168.1.102'
    },
    {
        id: 4,
        user: 'Admin User',
        role: 'Administrator',
        action: 'Modified menu item',
        details: 'Updated price of "Margherita Pizza"',
        timestamp: '2024-01-20 15:00:00',
        ipAddress: '192.168.1.103'
    },
    {
        id: 5,
        user: 'John Smith',
        role: 'Server',
        action: 'Modified order',
        details: 'Added items to Order #1235',
        timestamp: '2024-01-20 15:15:30',
        ipAddress: '192.168.1.100'
    }
];

export default function AuditLogs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedAction, setSelectedAction] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const roles = ['all', 'Administrator', 'Server', 'Cashier', 'Kitchen Staff'];
    const actions = ['all', 'Created new order', 'Processed payment', 'Updated order status', 'Modified menu item', 'Modified order'];

    // Filter logs based on search and filters
    const filteredLogs = mockAuditLogs.filter(log => {
        const matchesSearch =
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = selectedRole === 'all' || log.role === selectedRole;
        const matchesAction = selectedAction === 'all' || log.action === selectedAction;

        return matchesSearch && matchesRole && matchesAction;
    });

    return (
        <DashboardLayout>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    View and monitor all system activities and user actions
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md bg-orange-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                            onClick={() => window.location.reload()}
                        >
                            <ArrowPathIcon className="h-4 w-4" />
                            Refresh Logs
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                        {/* Search and Quick Filters */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search logs..."
                                        className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role === 'all' ? 'All Roles' : role}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedAction}
                                    onChange={(e) => setSelectedAction(e.target.value)}
                                    className="rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                >
                                    {actions.map(action => (
                                        <option key={action} value={action}>
                                            {action === 'all' ? 'All Actions' : action}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="block rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                />
                            </div>
                            <span className="text-gray-500">to</span>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="block rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IP Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.user}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            {log.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {log.details}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.ipAddress}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
