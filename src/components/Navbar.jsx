import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
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

    const fetchSuggestions = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://games-be.vercel.app'}/api/games/search?search=${encodeURIComponent(query.trim())}&limit=5`);
            setSuggestions(Array.isArray(res.data) ? res.data : []);
            setShowSuggestions(true);
        } catch (e) {
            console.error('Failed to fetch suggestions:', e);
            setSuggestions([]);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length > 0) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
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
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        className="bg-gray-700 text-gray-200 text-sm rounded-full pl-4 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-width duration-300 focus:w-64"
                                    />
                                    <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </button>
                                </form>
                                
                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                                        {suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-700 text-gray-200 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg"
                                            >
                                                {suggestion.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
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
                    <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <span className="hidden sm:inline">Games</span>
                    </Link>
                    <Link to="/multiplayer" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="hidden sm:inline">Share Code With Friend</span>
                    </Link>

                    <div className="px-3 pt-2">
                        <div className="text-gray-400 text-xs mb-2 hidden sm:block">Categories</div>
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
                            <Link to="/profile" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                            <button onClick={logout} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                <span className="hidden sm:inline">Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
