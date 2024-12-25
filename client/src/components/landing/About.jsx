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
        <div id="about" className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
                >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
                        <div>
                            <SectionLabel>About DineTrack</SectionLabel>
                            <SectionTitle className="mt-2">
                                Revolutionizing Restaurant Management
                            </SectionTitle>
                            <BodyLarge className="mt-6">
                                DineTrack is revolutionizing restaurant management with cutting-edge POS technology.
                                We understand the unique challenges of the food service industry and have crafted
                                solutions that empower restaurants to succeed.
                            </BodyLarge>
                            <div className="mt-8 space-y-4">
                                {highlights.map((highlight, index) => (
                                    <motion.div
                                        key={highlight}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-x-3"
                                    >
                                        <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100">
                                            <CheckIcon className="h-4 w-4 text-orange-600" aria-hidden="true" />
                                        </div>
                                        <BodyText>{highlight}</BodyText>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-10">
                                <motion.a
                                    href="#contact"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors duration-200"
                                >
                                    Get Started Today
                                    <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
                                </motion.a>
                            </div>
                        </div>
                        <div className="relative">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg"
                                alt="Restaurant team working"
                                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 