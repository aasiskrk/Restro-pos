import { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Select = forwardRef(
    ({ label, options, error, className = '', placeholder = 'Select an option', ...props }, ref) => {
        return (
            <div>
                {label && (
                    <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
                        {label}
                    </label>
                )}
                <div className="relative mt-2">
                    <select
                        ref={ref}
                        className={`
              block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 
              ring-1 ring-inset ring-gray-300 
              focus:ring-2 focus:ring-primary-600 
              sm:text-sm sm:leading-6
              ${error ? 'ring-red-300 focus:ring-red-500' : ''}
              ${className}
            `}
                        {...props}
                    >
                        <option value="">{placeholder}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select; 