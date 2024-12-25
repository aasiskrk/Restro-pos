import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
    return (
        <div>
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </label>
            )}
            <div className="mt-2">
                <input
                    ref={ref}
                    className={`
            block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
            ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
            focus:ring-2 focus:ring-inset focus:ring-primary-600 
            sm:text-sm sm:leading-6
            ${error ? 'ring-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input; 