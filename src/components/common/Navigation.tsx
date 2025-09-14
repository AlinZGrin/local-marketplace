import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
    return (
        <nav className="flex space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
            </Link>
            <Link href="/listings" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Listings
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Messages
            </Link>
            <Link href="/notifications" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Notifications
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Profile
            </Link>
            <Link href="/auth" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Login/Register
            </Link>
        </nav>
    );
};

export default Navigation;