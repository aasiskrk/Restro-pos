const variants = {
    gray: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    red: 'bg-red-50 text-red-700 ring-red-600/10',
    yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    green: 'bg-green-50 text-green-700 ring-green-600/20',
    blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
    primary: 'bg-primary-50 text-primary-700 ring-primary-700/10',
};

const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-3 py-1 text-base',
};

export default function Badge({
    children,
    variant = 'gray',
    size = 'md',
    className = ''
}) {
    return (
        <span
            className={`
        inline-flex items-center rounded-md font-medium ring-1 ring-inset
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
} 