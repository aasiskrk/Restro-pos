import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { SectionLabel, SectionTitle } from '../common/Typography';

export default function Contact() {
    return (
        <div id="contact" className="relative bg-gradient-to-b from-orange-50 to-white py-16 sm:py-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative px-6 pb-16 pt-16 sm:pt-24 lg:static lg:px-8 lg:py-32"
                >
                    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                        <SectionLabel>Contact Us</SectionLabel>
                        <SectionTitle className="mt-2">Get in Touch</SectionTitle>
                        <p className="mt-6 text-base leading-7 text-gray-600">
                            Ready to transform your restaurant operations? Contact us today to learn how DineTrack can help your business thrive.
                        </p>
                        <dl className="mt-8 space-y-4 text-base leading-7 text-gray-600">
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Email</span>
                                    <EnvelopeIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                </dt>
                                <dd>
                                    <a className="text-orange-600 hover:text-orange-500" href="mailto:contact@dinetrack.com">
                                        contact@dinetrack.com
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Phone</span>
                                    <PhoneIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                </dt>
                                <dd>
                                    <a className="text-orange-600 hover:text-orange-500" href="tel:+1 (555) 234-5678">
                                        +1 (555) 234-5678
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </motion.div>
                <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="px-6 pb-16 pt-16 sm:pt-24 lg:px-8 lg:py-32"
                >
                    <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-900">
                                    First name
                                </label>
                                <div className="mt-1.5">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-1.5">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Email
                                </label>
                                <div className="mt-1.5">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                                    Message
                                </label>
                                <div className="mt-1.5">
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={3}
                                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full rounded-md bg-orange-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors duration-200"
                            >
                                Send Message
                            </motion.button>
                        </div>
                    </div>
                </motion.form>
            </div>
        </div>
    );
} 