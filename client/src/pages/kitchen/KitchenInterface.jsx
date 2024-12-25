import { useState } from 'react';
import {
    HomeIcon,
    QueueListIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/kitchen' },
    { name: 'Active Orders', icon: QueueListIcon, href: '/kitchen/orders' },
    { name: 'Order History', icon: ClockIcon, href: '/kitchen/history' },
    { name: 'Inventory Alerts', icon: ExclamationTriangleIcon, href: '/kitchen/alerts' },
];

export default function KitchenInterface() {
    return (
        <DashboardLayout navigation={navigation}>
            {/* Your existing kitchen content */}
        </DashboardLayout>
    );
} 