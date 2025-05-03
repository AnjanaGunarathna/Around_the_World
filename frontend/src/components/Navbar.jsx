import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api';

export default function Navbar()
{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() =>
    {
        const checkAuth = async () =>
        {
            try
            {
                const res = await API.get('/auth/getuserdetails');
                if (res.data && res.data.userdetails)
                {
                    setIsLoggedIn(true);
                    setUserName(res.data.userdetails.firstName || 'User');
                }
            } catch (err)
            {
                setIsLoggedIn(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () =>
    {
        try
        {
            await API.post('/auth/logout');
            setIsLoggedIn(false);
            window.location.href = '/';
        } catch (err)
        {
            console.error("Logout failed:", err);
        }
    };

    const toggleMenu = () =>
    {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-indigo-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/onboard" className="flex-shrink-0 flex items-center">
                            <svg className="h-8 w-8 text-indigo-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2.5M15 11h3.5a2 2 0 012 2v1a2 2 0 01-2 2h-2.5M6.5 19.25V16.5a2 2 0 012-2h7a2 2 0 012 2v2.75M12 14.75L12 16.5" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-white">Around the World</span>
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:space-x-4">
                            <Link to="/onboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/'
                                    ? 'text-white bg-indigo-800'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                                Home
                            </Link>
                            <Link to="/home"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('/home')
                                    ? 'text-white bg-indigo-800'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                                Countries
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center">
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-indigo-100">Welcome, {userName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition duration-150 ease-in-out">
                                    Logout
                                </button>
                                <Link to="/profile"
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/profile'
                                        ? 'text-white bg-indigo-800'
                                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                                    Profile
                                </Link>
                            </div>

                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white">
                                    Login
                                </Link>
                                <Link to="/register"
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition duration-150 ease-in-out">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-600 focus:outline-none"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/'
                                ? 'text-white bg-indigo-800'
                                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                            Home
                        </Link>
                        <Link to="/countries"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.includes('/countries')
                                ? 'text-white bg-indigo-800'
                                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                            Countries
                        </Link>
                        {isLoggedIn && (
                            <Link to="/favorites"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/favorites'
                                    ? 'text-white bg-indigo-800'
                                    : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                                My Favorites
                            </Link>
                        )}
                        <Link to="/about"
                            className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about'
                                ? 'text-white bg-indigo-800'
                                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                            About
                        </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-indigo-800">
                        {isLoggedIn ? (
                            <div className="px-2 space-y-1">
                                <div className="px-3 py-2 text-indigo-100">Welcome, {userName}</div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="px-2 space-y-1">
                                <Link to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white">
                                    Login
                                </Link>
                                <Link to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
