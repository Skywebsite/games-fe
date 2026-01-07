import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const categoryParam = new URLSearchParams(location.search).get('category') || '';
    const categories = ['Action', 'Adventure', 'Puzzle', 'Sports', 'Racing', 'Shooting', 'Fighting', 'Multiplayer'];

    const handleCategoryChange = (value) => {
        if (!value) {
            navigate('/');
            return;
        }
        navigate(`/?category=${encodeURIComponent(value)}`);
    };

    return (
        <nav className="bg-dark-card border-b border-gray-800 sticky top-0 z-50">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={logo} alt="SkyGames" className="h-12 w-auto" />
                            <span className="text-2xl font-black tracking-tight text-white font-sans hidden sm:block">
                                Sky<span className="text-blue-500">Games</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Games</Link>
                            <Link to="/multiplayer" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Share Code With Friend</Link>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleCategoryChange('')}
                                    className={`${!categoryParam ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:text-white'} text-sm rounded-full px-4 py-1.5 transition-colors`}
                                >
                                    All
                                </button>
                                {categories.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => handleCategoryChange(c)}
                                        className={`${categoryParam.toLowerCase() === c.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:text-white'} text-sm rounded-full px-4 py-1.5 transition-colors`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-gray-700 text-gray-200 text-sm rounded-full pl-4 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-width duration-300 focus:w-64"
                                />
                                <svg className="w-4 h-4 absolute right-3 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* User User */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            {user ? (
                                <>
                                    <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                    </Link>
                                    <button onClick={logout} className="text-gray-400 hover:text-white text-sm font-medium">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                    <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
                    <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Games</Link>
                    <Link to="/multiplayer" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Share Code With Friend</Link>

                    <div className="px-3 pt-2">
                        <div className="text-gray-400 text-xs mb-2">Categories</div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('')}
                                className={`${!categoryParam ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'} text-sm rounded-full px-4 py-2`}
                            >
                                All
                            </button>
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => handleCategoryChange(c)}
                                    className={`${categoryParam.toLowerCase() === c.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'} text-sm rounded-full px-4 py-2`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                    {user ? (
                        <>
                            <Link to="/profile" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                            <button onClick={logout} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
