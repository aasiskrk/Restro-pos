import { useState } from 'react';
import {
    TableCellsIcon,
    BellAlertIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { BellAlertIcon as BellAlertIconSolid } from '@heroicons/react/24/solid';
import DashboardLayout from '../../components/layout/DashboardLayout';

const navigation = [
    { name: 'Kitchen Display', icon: TableCellsIcon, href: '/kitchen', current: false },
    { name: 'Inventory Alert', icon: BellAlertIcon, href: '/kitchen/inventory', current: true },
];

// Mock data for inventory alerts
const inventoryAlerts = [
    {
        id: 1,
        name: 'Chicken Breast',
        currentStock: 5,
        minRequired: 20,
        unit: 'kg',
        category: 'Meat',
        status: 'critical'
    },
    {
        id: 2,
        name: 'Tomatoes',
        currentStock: 8,
        minRequired: 15,
        unit: 'kg',
        category: 'Vegetables',
        status: 'low'
    },
    {
        id: 3,
        name: 'Mozzarella Cheese',
        currentStock: 3,
        minRequired: 10,
        unit: 'kg',
        category: 'Dairy',
        status: 'critical'
    },
    {
        id: 4,
        name: 'Olive Oil',
        currentStock: 4,
        minRequired: 8,
        unit: 'L',
        category: 'Condiments',
        status: 'low'
    }
];

export default function InventoryAlert() {
    const [searchQuery, setSearchQuery] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'low':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredAlerts = inventoryAlerts.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout navigation={navigation}>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <BellAlertIconSolid className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Inventory Alerts</h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Monitor low stock items and inventory alerts
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                </div>

                {/* Alerts Table */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Item Name</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Current Stock</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Min Required</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {filteredAlerts.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <div className="flex items-center gap-2">
                                                        {item.status === 'critical' && (
                                                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                                                        )}
                                                        {item.name}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.category}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {item.currentStock} {item.unit}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {item.minRequired} {item.unit}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>
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
        </DashboardLayout>
    );
} 