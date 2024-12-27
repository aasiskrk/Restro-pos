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
        <div id="features" className="relative bg-gradient-to-b from-white via-orange-50/20 to-white py-16 sm:py-24 overflow-hidden">
            {/* Layered Background */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.15),_transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(251,146,60,0.15),_transparent_70%)]"></div>

                {/* Abstract Mesh Pattern - Layer 1 */}
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.15]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="features-mesh-1"
                            x="0"
                            y="0"
                            width="100"
                            height="100"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(30)"
                        >
                            <path
                                d="M50 0L100 50L50 100L0 50Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-300"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="2"
                                fill="currentColor"
                                className="text-orange-400"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#features-mesh-1)" />
                </svg>

                {/* Abstract Mesh Pattern - Layer 2 */}
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.07]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="features-mesh-2"
                            x="0"
                            y="0"
                            width="60"
                            height="60"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(60)"
                        >
                            <path
                                d="M30 0L60 30L30 60L0 30Z M15 15L45 15L45 45L15 45Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-500"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#features-mesh-2)" />
                </svg>

                {/* Dot Pattern Overlay */}
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.15]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="features-dots"
                            x="0"
                            y="0"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(45)"
                        >
                            <circle cx="1" cy="1" r="1" className="text-orange-300" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#features-dots)" />
                </svg>

                {/* Floating shapes */}
                <div className="absolute right-0 top-1/4 -translate-y-1/2 translate-x-1/2">
                    <div className="h-96 w-96 rounded-full bg-orange-200/40 blur-3xl animate-pulse"></div>
                </div>
                <div className="absolute left-0 bottom-1/4 translate-y-1/2 -translate-x-1/2">
                    <div className="h-96 w-96 rounded-full bg-orange-100/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Additional decorative grid */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(251,146,60,0.05) 2px, transparent 2px), 
                                    linear-gradient(90deg, rgba(251,146,60,0.05) 2px, transparent 2px)`,
                    backgroundSize: '60px 60px',
                    backgroundPosition: 'center center'
                }}></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl text-center relative"
                >
                    <div className="relative">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-100/0 via-orange-100/80 to-orange-100/0 blur-xl"></div>
                        <SectionLabel>Powerful Features</SectionLabel>
                        <SectionTitle className="mt-2">
                            Everything you need to manage your restaurant
                        </SectionTitle>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mx-auto mt-12 sm:mt-16 lg:mt-16 max-w-7xl"
                >
                    <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.name}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className="relative flex flex-col rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden ring-1 ring-black/[0.08]"
                            >
                                <div
                                    className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.10] transition-opacity duration-300"
                                    style={{
                                        backgroundImage: `url(${feature.bgImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-orange-50/20"></div>
                                <dt className="flex items-center gap-x-3 relative">
                                    <div className={`rounded-lg ${feature.color} p-2.5 ring-1 ring-inset ring-black/[0.08] group-hover:scale-110 transition-transform duration-300 relative shadow-md`}>
                                        <feature.icon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <CardTitle>{feature.name}</CardTitle>
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col relative">
                                    <BodyText className="flex-auto text-sm">
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