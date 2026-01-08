import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/GameCard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://games-be.vercel.app';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setGames([]);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError('');
                const res = await axios.get(`${API_BASE_URL}/api/games?search=${encodeURIComponent(query.trim())}`);
                setGames(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                setError(e?.response?.data?.message || e.message || 'Failed to load search results');
                setGames([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    if (loading) return <div className="text-white text-center mt-20">Searching...</div>;
    if (error) return <div className="text-red-400 text-center mt-20">{error}</div>;
    if (!query.trim()) return <div className="text-gray-400 text-center mt-20">Enter a search term.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold">
                    Results for "<span className="text-blue-400">{query}</span>"
                </h1>
                <p className="text-gray-400 mt-2">
                    {games.length} {games.length === 1 ? 'game' : 'games'} found
                </p>
            </header>

            {games.length === 0 ? (
                <div className="text-gray-400">No games found. Try different keywords.</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {games.map(game => (
                        <GameCard key={game._id} game={game} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
