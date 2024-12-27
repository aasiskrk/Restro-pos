import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { SectionLabel, SectionTitle, BodyLarge, BodyText } from '../common/Typography';

const highlights = [
    'Over 10 years of industry experience',
    'Trusted by 1000+ restaurants globally',
    'Award-winning customer support',
    '99.9% uptime guarantee'
];

export default function About() {
    return (
        <div id="about" className="relative isolate overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white via-orange-50/10 to-white">
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,146,60,0.15),_transparent_80%)]"></div>
                <svg
                    className="absolute inset-0 h-full w-full opacity-25"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="about-mesh"
                            width="32"
                            height="32"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(30)"
                        >
                            <path
                                d="M16 0L32 16L16 32L0 16Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                className="text-orange-300"
                            />
                            <circle
                                cx="16"
                                cy="16"
                                r="1.5"
                                fill="currentColor"
                                className="text-orange-400"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#about-mesh)" />
                </svg>
                <div className="absolute -left-32 -top-32">
                    <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-200/30 to-orange-100/30 blur-3xl animate-pulse"></div>
                </div>
                <div className="absolute -right-32 -bottom-32">
                    <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-orange-100/30 to-orange-50/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(251,146,60,0.07) 1.5px, transparent 1.5px),
                                    linear-gradient(to right, rgba(251,146,60,0.07) 1.5px, transparent 1.5px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
                >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-2 lg:items-center">
                        <div className="relative">
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-100/0 via-orange-100/60 to-orange-100/0 blur-xl"></div>
                            <SectionLabel>About DineTrack</SectionLabel>
                            <SectionTitle className="mt-2">
                                Revolutionizing Restaurant Management
                            </SectionTitle>
                            <BodyLarge className="mt-6 text-gray-600">
                                DineTrack is revolutionizing restaurant management with cutting-edge POS technology.
                                We understand the unique challenges of the food service industry and have crafted
                                solutions that empower restaurants to succeed.
                            </BodyLarge>
                            <div className="mt-8 space-y-3">
                                {highlights.map((highlight, index) => (
                                    <motion.div
                                        key={highlight}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-x-3 group"
                                    >
                                        <div className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 shadow-md ring-1 ring-black/[0.08] group-hover:scale-110 transition-transform duration-300">
                                            <CheckIcon className="h-3.5 w-3.5 text-orange-600" aria-hidden="true" />
                                        </div>
                                        <BodyText className="text-gray-600">{highlight}</BodyText>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <motion.a
                                    href="#contact"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-md shadow-lg hover:from-orange-500 hover:to-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all duration-200"
                                >
                                    Get Started Today
                                    <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
                                </motion.a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-100/50 to-orange-50/50 rounded-2xl transform rotate-3 scale-105 blur-sm"></div>
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg"
                                alt="Restaurant team working"
                                className="relative w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 group-hover:ring-black/20 transition-colors duration-300"></div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-orange-200 to-orange-100 rounded-full opacity-50 blur-2xl"></div>
                            <div className="absolute -left-4 -top-4 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full opacity-50 blur-2xl"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 