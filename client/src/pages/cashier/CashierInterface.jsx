import { useState } from 'react';
import {
    HomeIcon,
    CurrencyDollarIcon,
    ClockIcon,
    CalculatorIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/layout/DashboardLayout';

const navigation = [
    { name: 'Dashboard', icon: HomeIcon, href: '/cashier' },
    { name: 'Checkout', icon: CurrencyDollarIcon, href: '/cashier/checkout' },
    { name: 'Payment History', icon: ClockIcon, href: '/cashier/history' },
    { name: 'Reports', icon: CalculatorIcon, href: '/cashier/reports' },
];

export default function CashierInterface() {
    return (
        <DashboardLayout navigation={navigation}>
            {/* Your existing cashier content */}
        </DashboardLayout>
    );
} 