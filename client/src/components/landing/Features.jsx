import { motion } from 'framer-motion';
import {
    ShoppingCartIcon,
    ChartBarIcon,
    ClockIcon,
    ServerStackIcon,
    CurrencyDollarIcon,
    DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { SectionLabel, SectionTitle, CardTitle, BodyText } from '../common/Typography';

const features = [
    {
        name: 'Smart POS System',
        description: 'Intuitive point-of-sale interface with quick order processing and customizable menu management.',
        icon: ShoppingCartIcon,
        color: 'bg-rose-50 text-rose-600',
        bgImage: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg'
    },
    {
        name: 'Real-time Analytics',
        description: 'Track sales, inventory, and staff performance with detailed reports and actionable insights.',
        icon: ChartBarIcon,
        color: 'bg-blue-50 text-blue-600',
        bgImage: 'https://images.pexels.com/photos/7947452/pexels-photo-7947452.jpeg'
    },
    {
        name: 'Order Management',
        description: 'Streamline kitchen operations with real-time order tracking and status updates.',
        icon: ServerStackIcon,
        color: 'bg-purple-50 text-purple-600',
        bgImage: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg'
    },
    {
        name: 'Time-Saving Automation',
        description: 'Automate routine tasks like inventory tracking, staff scheduling, and report generation.',
        icon: ClockIcon,
        color: 'bg-green-50 text-green-600',
        bgImage: 'https://images.pexels.com/photos/7947452/pexels-photo-7947452.jpeg'
    },
    {
        name: 'Payment Integration',
        description: 'Seamlessly handle multiple payment methods including cards, mobile payments, and digital wallets.',
        icon: CurrencyDollarIcon,
        color: 'bg-amber-50 text-amber-600',
        bgImage: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg'
    },
    {
        name: 'Mobile Ordering',
        description: 'Enable customers to place orders directly from their phones with our integrated mobile ordering system.',
        icon: DevicePhoneMobileIcon,
        color: 'bg-indigo-50 text-indigo-600',
        bgImage: 'https://images.pexels.com/photos/7947452/pexels-photo-7947452.jpeg'
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function Features() {
    return (
        <div id="features" className="relative bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center"
                >
                    <SectionLabel>Powerful Features</SectionLabel>
                    <SectionTitle className="mt-2">
                        Everything you need to manage your restaurant
                    </SectionTitle>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
                >
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.name}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className="relative flex flex-col rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-300"
                                    style={{
                                        backgroundImage: `url(${feature.bgImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <dt className="flex items-center gap-x-4">
                                    <div className={`rounded-lg ${feature.color} p-3 ring-1 ring-inset ring-gray-200/20 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <CardTitle>{feature.name}</CardTitle>
                                </dt>
                                <dd className="mt-6 flex flex-auto flex-col">
                                    <BodyText className="flex-auto">
                                        {feature.description}
                                    </BodyText>
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </motion.div>
            </div>
        </div>
    );
} 