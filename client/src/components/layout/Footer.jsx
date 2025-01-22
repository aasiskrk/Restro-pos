import { Link } from 'react-router-dom';

const navigation = {
    main: [
        { name: 'About', href: '#' },
        { name: 'Features', href: '#' },
        { name: 'Documentation', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-white" aria-labelledby="footer-heading">
            <div className="mx-auto max-w-7xl px-6 py-8 md:flex md:items-center md:justify-between">
                <div className="flex justify-center space-x-6 md:order-2">
                    {navigation.main.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <Link to="/" className="text-primary-600 font-display text-xl font-bold">
                        DineTrack
                    </Link>
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                        &copy; 2024 DineTrack, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
} 