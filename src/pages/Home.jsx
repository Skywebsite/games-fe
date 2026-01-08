import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GameCard from '../components/GameCard';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://games-be.vercel.app';

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const categoryParam = new URLSearchParams(location.search).get('category') || '';

    const categoryCards = [
        { label: 'Simulation Games', value: 'Simulation', image: 'https://cdn-icons-png.flaticon.com/512/1998/1998627.png' },
        { label: 'Adventure Games', value: 'Adventure', image: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png' },
        { label: 'Multiplayer Games', value: 'Multiplayer', image: 'https://cdn-icons-png.flaticon.com/512/3768/3768094.png' },
        { label: 'Platform Games', value: 'Platform', image: 'https://cdn-icons-png.flaticon.com/512/3330/3330314.png' },
        { label: 'Mobile Games', value: 'Mobile', image: 'https://cdn-icons-png.flaticon.com/512/545/545245.png' },
        { label: 'Skill Games', value: 'Skill', image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
        { label: 'Cool Games', value: 'Cool', image: 'https://cdn-icons-png.flaticon.com/512/742/742751.png' },
        { label: 'Co-Op Games', value: 'Co-op', image: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png' },
        { label: 'Stickman Games', value: 'Stickman', image: 'https://cdn-icons-png.flaticon.com/512/2571/2571393.png' },
        { label: 'Games For Boys', value: 'Boys', image: 'https://cdn-icons-png.flaticon.com/512/2942/2942915.png' },
        { label: 'Action Games', value: 'Action', image: 'https://cdn-icons-png.flaticon.com/512/8090/8090772.png' },
        { label: '3D Games', value: '3D', image: 'https://cdn-icons-png.flaticon.com/512/1048/1048946.png' },
        { label: 'Cozy Games', value: 'Cozy', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046873.png' },
        { label: 'Parkour Games', value: 'Parkour', image: 'https://cdn-icons-png.flaticon.com/512/3013/3013817.png' },
        { label: 'Escape Games', value: 'Escape', image: 'https://cdn-icons-png.flaticon.com/512/2593/2593342.png' },
        { label: 'Dress Up Games', value: 'Dress Up', image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png' },
        { label: 'War Games', value: 'War', image: 'https://cdn-icons-png.flaticon.com/512/3307/3307746.png' },
        { label: 'Funny Games', value: 'Funny', image: 'https://cdn-icons-png.flaticon.com/512/742/742920.png' },
        { label: 'Block Games', value: 'Block', image: 'https://cdn-icons-png.flaticon.com/512/814/814513.png' },
        { label: 'Gun Games', value: 'Gun', image: 'https://cdn-icons-png.flaticon.com/512/3106/3106807.png' },
        { label: 'Arcade Games', value: 'Arcade', image: 'https://cdn-icons-png.flaticon.com/512/686/686589.png' },
        { label: 'Crazy Games', value: 'Crazy', image: 'https://cdn-icons-png.flaticon.com/512/742/742752.png' },
        { label: 'Racing Games', value: 'Racing', image: 'https://cdn-icons-png.flaticon.com/512/3097/3097144.png' },
        { label: 'Brain Games', value: 'Brain', image: 'https://cdn-icons-png.flaticon.com/512/387/387561.png' },
        { label: 'Driving Games', value: 'Driving', image: 'https://cdn-icons-png.flaticon.com/512/296/296216.png' },
        { label: 'Mouse Games', value: 'Mouse', image: 'https://cdn-icons-png.flaticon.com/512/2849/2849899.png' },
        { label: 'IO Games', value: 'IO', image: 'https://cdn-icons-png.flaticon.com/512/1055/1055646.png' },
        { label: 'Flash Games', value: 'Flash', image: 'https://cdn-icons-png.flaticon.com/512/2306/2306108.png' },
        { label: 'Watermelon Games', value: 'Watermelon', image: 'https://cdn-icons-png.flaticon.com/512/415/415733.png' },
        { label: 'Dinosaur Games', value: 'Dinosaur', image: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' },
        { label: 'Tycoon Games', value: 'Tycoon', image: 'https://cdn-icons-png.flaticon.com/512/4207/4207253.png' },
        { label: 'All Categories', value: '', image: 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png' }
    ];

    const handleCategoryChange = (value) => {
        if (!value) {
            navigate('/');
            return;
        }
        navigate(`/?category=${encodeURIComponent(value)}`);
    };

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await axios.get(`${API_BASE_URL}/api/games`);
                const all = Array.isArray(res.data) ? res.data : [];
                const filtered = categoryParam
                    ? all.filter((g) => (g.category || '').toLowerCase() === categoryParam.toLowerCase())
                    : all;
                setGames(filtered);
            } catch (e) {
                setError(e?.response?.data?.message || e.message || 'Failed to load games');
                setGames([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [categoryParam]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    SkyGames
                </h1>
                <p className="text-gray-400 mt-2">Play the best online games for free!</p>
            </header>

            <div className="mb-8 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 p-4 sm:p-6">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {categoryCards.map((c) => (
                        <button
                            key={c.label}
                            type="button"
                            onClick={() => handleCategoryChange(c.value)}
                            className={`group ${
                                (categoryParam || '').toLowerCase() === (c.value || '').toLowerCase()
                                    ? 'ring-2 ring-blue-600'
                                    : 'ring-1 ring-black/10'
                            } bg-white rounded-xl p-3 shadow-md flex items-center justify-center text-left transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-white/70 active:translate-y-0`}
                        >
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-2">
                                <img src={c.image} alt={c.label} className="w-10 h-10 object-contain" />
                            </div>
                            <div className="hidden sm:block text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase text-gray-900 leading-tight transition-colors duration-200 group-hover:text-blue-700 ml-3">
                                {c.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="text-gray-400">Loading games...</div>
            )}

            {!loading && error && (
                <div className="text-red-400">{error}</div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {games.map(game => (
                    <GameCard key={game._id} game={game} />
                ))}
            </div>
        </div>
    );
};

export default Home;
