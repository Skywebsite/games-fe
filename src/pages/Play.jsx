import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://games-be.vercel.app';

const Play = () => {
    const { slug } = useParams();
    const socket = useSocket();
    const { user, token } = useAuth();
    const iframeRef = useRef(null);
    const [game, setGame] = useState(null);
    const [friendsPlaying, setFriendsPlaying] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await axios.get(`${API_BASE_URL}/api/games/${slug}`);
                setGame(res.data);
            } catch (e) {
                setGame(null);
                setError(e?.response?.data?.message || e.message || 'Failed to load game');
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [slug]);

    useEffect(() => {
        const recordRecentlyPlayed = async () => {
            if (!token || !game?._id) return;
            try {
                await axios.post(`${API_BASE_URL}/api/users/recently-played`,
                    { gameId: game._id },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } catch (e) {
                // ignore
            }
        };

        recordRecentlyPlayed();
    }, [token, game?._id]);

    // Realtime Friends System
    useEffect(() => {
        if (!socket || !game || !user) return;

        // Notify server we are playing
        socket.emit('start-playing', { gameId: game._id, userId: user._id });

        // Listen for friends updates
        socket.on('friends-activity-update', (data) => {
            // data could be [{ username: 'Rahul', game: 'Subway Surfers' }]
            setFriendsPlaying(data);
        });

        return () => {
            socket.off('friends-activity-update');
        };
    }, [socket, game, user]);


    const toggleFullscreen = () => {
        if (iframeRef.current) {
            if (iframeRef.current.requestFullscreen) {
                iframeRef.current.requestFullscreen();
            }
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading game...</div>;
    if (error) return <div className="text-red-400 text-center mt-20">{error}</div>;
    if (!game) return <div className="text-white text-center mt-20">Game not found</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-900">
            {/* Game Area - Maximized */}
            <div className="flex-grow relative bg-black flex items-center justify-center overflow-hidden">
                <iframe
                    ref={iframeRef}
                    src={game.gameUrl} // Note: Many sites display X-Frame-Options: DENY. For a real app, you serve the game files yourself.
                    title={game.title}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
                />

                {/* Floating Controls */}
                <div className="absolute bottom-4 right-4 flex space-x-4">
                    <button
                        onClick={toggleFullscreen}
                        className="bg-gray-800 bg-opacity-70 hover:bg-opacity-100 text-white p-3 rounded-full transition-all"
                        title="Fullscreen"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    </button>
                </div>
            </div>

            {/* Info Bar */}
            <div className="bg-gray-800 p-4 border-t border-gray-700 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-white">{game.title}</h1>
                    <p className="text-gray-400 text-sm">{game.description}</p>
                </div>

                {/* Friends Playing Section */}
                <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm hidden sm:inline">Friends playing:</span>
                    <div className="flex -space-x-2">
                        {/* Mock data if empty for visual */}
                        {friendsPlaying.length === 0 && (
                            <>
                                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white" title="Rahul is playing Subway Surfers">R</div>
                                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white" title="Priya is playing">P</div>
                            </>
                        )}
                        {friendsPlaying.map((friend, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white" title={`${friend.username} is playing`}>
                                {friend.username[0]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;
