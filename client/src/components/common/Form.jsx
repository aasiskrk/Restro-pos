import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Input = forwardRef(({ label, error, ...props }, ref) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    ref={ref}
                    className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900
                        bg-white/50 backdrop-blur-sm shadow-sm
                        ring-1 ring-inset ring-gray-300/50
                        placeholder:text-gray-400 
                        transition-all duration-200 ease-out
                        group-hover:ring-orange-500/50
                        focus:ring-2 focus:ring-inset focus:ring-orange-500 focus:shadow-orange-500/20
                        ${error ? 'ring-red-500' : ''}
                        sm:text-sm sm:leading-6`}
                    {...props}
                />
                <div className="absolute inset-0 rounded-xl transition-opacity duration-200 
                    bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10 opacity-0 
                    group-hover:opacity-100 pointer-events-none"
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
});

export const Select = forwardRef(({ label, children, error, ...props }, ref) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    ref={ref}
                    className={`block w-full rounded-xl border-0 py-3 px-4 text-gray-900 
                        bg-white/50 backdrop-blur-sm shadow-sm
                        ring-1 ring-inset ring-gray-300/50
                        transition-all duration-200 ease-out
                        group-hover:ring-orange-500/50
                        focus:ring-2 focus:ring-inset focus:ring-orange-500 focus:shadow-orange-500/20
                        ${error ? 'ring-red-500' : ''}
                        sm:text-sm sm:leading-6`}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute inset-0 rounded-xl transition-opacity duration-200 
                    bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10 opacity-0 
                    group-hover:opacity-100 pointer-events-none"
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-red-600 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
});

export const Button = forwardRef(({ children, variant = "primary", className = "", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 focus:ring-orange-500",
        secondary: "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-orange-500",
        danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
});
