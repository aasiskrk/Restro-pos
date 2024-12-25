import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

export default function Table({
    columns,
    data,
    onRowClick,
    isLoading = false,
    emptyMessage = 'No data available',
}) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 ${column.sortable ? 'cursor-pointer select-none' : ''
                                            }`}
                                        onClick={() => column.sortable && handleSort(column.key)}
                                    >
                                        <div className="group inline-flex">
                                            {column.header}
                                            {column.sortable && (
                                                <span className="ml-2 flex-none rounded text-gray-400">
                                                    {sortConfig.key === column.key ? (
                                                        sortConfig.direction === 'asc' ? (
                                                            <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                                                        ) : (
                                                            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                        )
                                                    ) : (
                                                        <ChevronUpIcon className="h-5 w-5 opacity-0 group-hover:opacity-100" aria-hidden="true" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-4 text-center text-sm text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : sortedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="py-4 text-center text-sm text-gray-500">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                sortedData.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0"
                                            >
                                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 