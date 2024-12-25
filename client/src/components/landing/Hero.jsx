import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <div className="relative isolate bg-gradient-to-b from-orange-600 to-orange-700 pt-14">
            <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
                <motion.div
                    className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Streamline Your Restaurant Operations
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-orange-100">
                        The all-in-one POS solution for modern restaurants. Manage orders, staff, and inventory with ease.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6">
                        <Link
                            to="/login"
                            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Get Started
                        </Link>
                        <a href="#features" className="text-sm font-semibold leading-6 text-white">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </motion.div>
                <motion.div
                    className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative isolate overflow-hidden rounded-2xl shadow-2xl">
                        <img
                            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
                            alt="Modern restaurant interior"
                            className="w-[48rem] max-w-none rounded-2xl bg-white/5 ring-1 ring-white/10 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 