import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function BackButton() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Link to="/">
                <motion.button
                    className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm border border-white/20"
                    whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.25)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Go back to home"
                >
                    <motion.div
                        whileHover={{ rotate: -180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-white" />
                    </motion.div>
                </motion.button>
            </Link>
        </motion.div>
    );
} 