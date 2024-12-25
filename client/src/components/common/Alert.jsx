import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const variants = {
    success: {
        icon: CheckCircleIcon,
        className: 'bg-green-50 text-green-800',
        iconClassName: 'text-green-400',
    },
    error: {
        icon: XCircleIcon,
        className: 'bg-red-50 text-red-800',
        iconClassName: 'text-red-400',
    },
};

export default function Alert({ type = 'success', message, onClose }) {
    const { icon: Icon, className, iconClassName } = variants[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-md p-4 ${className}`}
        >
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${iconClassName}`} aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`inline-flex rounded-md p-1.5 ${className} hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
} 