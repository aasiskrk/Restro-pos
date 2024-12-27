import { motion } from 'framer-motion';
import {
    ShieldCheckIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { SectionLabel, SectionTitle, CardTitle, BodyText } from '../common/Typography';

const benefits = [
    {
        name: 'Secure & Reliable',
        description: 'Enterprise-grade security with 99.9% uptime guarantee and automatic backups.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Cost-Effective',
        description: 'Affordable pricing plans with no hidden fees. Pay only for what you need.',
        icon: CurrencyDollarIcon,
    },
    {
        name: '24/7 Support',
        description: 'Dedicated customer support team available round the clock to help you.',
        icon: UserGroupIcon,
    },
    {
        name: 'Cloud-Based',
        description: 'Access your data from anywhere, anytime. No installation required.',
        icon: CloudArrowUpIcon,
    },
];

export default function WhyChooseUs() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/10 to-white">
            {/* Layered Background */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,146,60,0.2),_transparent_80%)]"></div>

                {/* Abstract Mesh Pattern - Layer 1 (Hexagons) */}
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.12]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="why-choose-hex"
                            width="80"
                            height="69.28"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(30)"
                        >
                            <path
                                d="M40 0L80 23.094L80 46.188L40 69.282L0 46.188L0 23.094Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-300"
                            />
                            <circle
                                cx="40"
                                cy="34.641"
                                r="2"
                                fill="currentColor"
                                className="text-orange-400"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#why-choose-hex)" />
                </svg>

                {/* Abstract Mesh Pattern - Layer 2 (Interlocking Circles) */}
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.08]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="why-choose-circles"
                            width="60"
                            height="60"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(45)"
                        >
                            <circle
                                cx="30"
                                cy="30"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-500"
                            />
                            <circle
                                cx="60"
                                cy="30"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-500"
                            />
                            <circle
                                cx="30"
                                cy="60"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-500"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#why-choose-circles)" />
                </svg>

                {/* Abstract Mesh Pattern - Layer 3 (Triangular Grid) */}
                <svg
                    className="absolute inset-0 h-full w-full opacity-[0.1]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="why-choose-triangles"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(0)"
                        >
                            <path
                                d="M20 0L40 40H0Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-300"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#why-choose-triangles)" />
                </svg>

                {/* Floating shapes with animation */}
                <div className="absolute left-1/4 top-0 -translate-x-1/2">
                    <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-orange-200/40 to-orange-100/40 blur-3xl animate-pulse"></div>
                </div>
                <div className="absolute right-1/4 bottom-0 translate-x-1/2">
                    <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-orange-100/40 to-orange-50/40 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Additional decorative grid */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(251,146,60,0.03) 1.5px, transparent 1.5px), 
                                    linear-gradient(90deg, rgba(251,146,60,0.03) 1.5px, transparent 1.5px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mx-auto max-w-2xl lg:text-center relative"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-100/0 via-orange-100/60 to-orange-100/0 blur-xl"></div>
                            <SectionLabel>Why Choose Us</SectionLabel>
                            <SectionTitle className="mt-2">
                                Trusted by restaurants worldwide
                            </SectionTitle>
                        </div>
                    </motion.div>

                    <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-16 lg:max-w-none">
                        <dl className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center group relative"
                                >
                                    <div className="absolute inset-0 -z-10 scale-[0.85] opacity-0 blur-2xl transition duration-500 group-hover:opacity-70">
                                        <div className="h-full w-full rounded-full bg-gradient-to-br from-orange-100 to-orange-50"></div>
                                    </div>
                                    <dt className="flex flex-col items-center gap-y-3">
                                        <div className="rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 p-3 group-hover:scale-110 transition-transform duration-300 relative ring-1 ring-black/[0.08] shadow-lg">
                                            <benefit.icon className="h-5 w-5 text-orange-600" aria-hidden="true" />
                                        </div>
                                        <CardTitle>{benefit.name}</CardTitle>
                                    </dt>
                                    <dd className="mt-2 flex flex-auto flex-col">
                                        <BodyText className="text-sm">{benefit.description}</BodyText>
                                    </dd>
                                </motion.div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
} 