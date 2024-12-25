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
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl lg:text-center"
                >
                    <SectionLabel>Why Choose Us</SectionLabel>
                    <SectionTitle className="mt-2">
                        Trusted by restaurants worldwide
                    </SectionTitle>
                </motion.div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center group"
                            >
                                <dt className="flex flex-col items-center gap-y-4">
                                    <div className="rounded-lg bg-orange-100 p-3 group-hover:scale-110 transition-transform duration-300">
                                        <benefit.icon className="h-6 w-6 text-orange-600" aria-hidden="true" />
                                    </div>
                                    <CardTitle>{benefit.name}</CardTitle>
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col">
                                    <BodyText>{benefit.description}</BodyText>
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
} 