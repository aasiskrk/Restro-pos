import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';

const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600',
    secondary: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
};

const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-3.5 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
};

const Button = forwardRef(
    (
        {
            variant = 'primary',
            size = 'md',
            className = '',
            href,
            isLoading = false,
            disabled = false,
            children,
            icon: Icon,
            ...props
        },
        ref
    ) => {
        const baseClasses = `
      inline-flex items-center justify-center rounded-md font-semibold
      shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

        const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

        const content = (
            <>
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                {Icon && !isLoading && <Icon className="mr-2 -ml-0.5 h-5 w-5" aria-hidden="true" />}
                {children}
            </>
        );

        if (href) {
            return (
                <Link to={href} className={classes} ref={ref} {...props}>
                    {content}
                </Link>
            );
        }

        return (
            <button className={classes} disabled={disabled || isLoading} ref={ref} {...props}>
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button; 