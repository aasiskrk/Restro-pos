import { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { 
    Bars3Icon, 
    XMarkIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon 
} from '@heroicons/react/24/outline';
import { SmallText } from '../common/Typography';
import logo from '../../assets/frame.svg';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                
                // For staff roles (server, kitchen, cashier), the data structure is different
                if (parsedUser.role !== 'admin') {
                    // Check all possible profile picture fields
                    const profilePic = parsedUser.profilePicture ||
                        parsedUser.image ||
                        parsedUser.profileImage ||
                        parsedUser.avatar;

                    // If profile picture exists, ensure it has the full URL
                    const fullProfilePic = profilePic ?
                        (profilePic.startsWith('http') ? profilePic : `http://localhost:5000${profilePic}`) :
                        null;

                    return {
                        ...parsedUser,
                        fullName: parsedUser.fullName || parsedUser.name,
                        profilePicture: fullProfilePic
                    };
                }

                // For admin, check if profile picture needs full URL
                if (parsedUser.profilePicture && !parsedUser.profilePicture.startsWith('http')) {
                    parsedUser.profilePicture = `http://localhost:5000${parsedUser.profilePicture}`;
                }

                return parsedUser;
            }
            return null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    });

    // Add effect to update user when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                
                // For staff roles (server, kitchen, cashier), the data structure is different
                if (parsedUser.role !== 'admin') {
                    // Check all possible profile picture fields
                    const profilePic = parsedUser.profilePicture ||
                        parsedUser.image ||
                        parsedUser.profileImage ||
                        parsedUser.avatar;

                    // If profile picture exists, ensure it has the full URL
                    const fullProfilePic = profilePic ?
                        (profilePic.startsWith('http') ? profilePic : `http://localhost:5000${profilePic}`) :
                        null;

                    setUser({
                        ...parsedUser,
                        fullName: parsedUser.fullName || parsedUser.name,
                        profilePicture: fullProfilePic
                    });
                } else {
                    // For admin, check if profile picture needs full URL
                    if (parsedUser.profilePicture && !parsedUser.profilePicture.startsWith('http')) {
                        parsedUser.profilePicture = `http://localhost:5000${parsedUser.profilePicture}`;
                    }
                    setUser(parsedUser);
                }
            } else {
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const getDashboardLink = (role) => {
        switch (role) {
            case 'admin':
                return '/admin';
            case 'server':
                return '/server';
            case 'kitchen':
                return '/kitchen';
            case 'cashier':
                return '/cashier';
            default:
                return '/';
        }
    };

    const getDashboardText = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin Dashboard';
            case 'server':
                return 'Server Interface';
            case 'kitchen':
                return 'Kitchen Display';
            case 'cashier':
                return 'Cashier Interface';
            default:
                return 'Dashboard';
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-white/100 backdrop-blur-md shadow-sm">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <div className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt="DineTrack Logo"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="font-display text-heading-2 font-bold text-orange-600">
                                DineTrack
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-body-1 font-semibold leading-6 text-gray-900 hover:text-orange-600"
                        >
                            {item.name}
                        </a>
                    ))}
                    {user && (
                        <Link
                            to={getDashboardLink(user.role)}
                            className="flex items-center gap-2 text-body-1 font-semibold leading-6 text-orange-600 hover:text-orange-500"
                        >
                            <ChartBarIcon className="h-5 w-5" />
                            {getDashboardText(user.role)}
                        </Link>
                    )}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
                    {user ? (
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-3 rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full overflow-hidden">
                                    {user?.profilePicture ? (
                                        <img
                                            className="h-full w-full object-cover"
                                            src={user.profilePicture}
                                            alt={user?.fullName}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = '<svg class="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                            <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {user?.fullName && (
                                    <div className="hidden md:flex md:items-center md:space-x-1">
                                        <span className="text-sm font-medium">{user.fullName}</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile"
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'flex px-4 py-2 text-sm text-gray-700'
                                                )}
                                            >
                                                <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/profile/settings"
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'flex px-4 py-2 text-sm text-gray-700'
                                                )}
                                            >
                                                <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                Settings
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={classNames(
                                                    active ? 'bg-gray-50' : '',
                                                    'flex w-full px-4 py-2 text-sm text-gray-700'
                                                )}
                                            >
                                                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-body-1 font-semibold leading-6 text-gray-900 hover:text-orange-600 px-3 py-1.5"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-md bg-orange-600 px-3 py-1.5 text-body-1 font-semibold leading-6 text-white hover:bg-orange-500"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </nav>
            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-50" />
                <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="font-display text-heading-2 font-bold text-orange-600">DineTrack</span>
                        </Link>
                        <button
                            type="button"
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                {user && (
                                    <Link
                                        to={getDashboardLink(user.role)}
                                        className="-mx-3 flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7 text-orange-600 hover:bg-orange-50"
                                    >
                                        <ChartBarIcon className="mr-3 h-5 w-5" />
                                        {getDashboardText(user.role)}
                                    </Link>
                                )}
                            </div>
                            <div className="py-6 space-y-2">
                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="-mx-3 flex items-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                            Profile
                                        </Link>
                                        <Link
                                            to="/profile/settings"
                                            className="-mx-3 flex items-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="-mx-3 flex w-full items-center rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/signup"
                                            className="-mx-3 block rounded-lg bg-orange-600 px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-orange-500"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </header>
    );
} 