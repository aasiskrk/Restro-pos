import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    TableCellsIcon,
    QueueListIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/server' },
    { name: 'Tables', icon: TableCellsIcon, href: '/server/tables' },
    { name: 'Menu', icon: QueueListIcon, href: '/server/menu' },
    { name: 'Order History', icon: ClockIcon, href: '/server/orders' },
];

export default function ServerInterface() {
    const [activeTab, setActiveTab] = useState('tables');

    return (
        <DashboardLayout navigation={navigation}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Server Dashboard</h1>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                    {/* Your existing server content */}
                </div>
            </div>
        </DashboardLayout>
    );
} 