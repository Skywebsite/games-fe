import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://games-be.vercel.app';

const Room = () => {
    const [roomCode, setRoomCode] = useState('');
    const [createdRoom, setCreatedRoom] = useState(null);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [games, setGames] = useState([]);
    const [friendsRooms, setFriendsRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const [gamesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/games`)
                ]);

                setGames(Array.isArray(gamesRes.data) ? gamesRes.data : []);
            } catch (e) {
                setGames([]);
                setError(e?.response?.data?.message || e.message || 'Failed to load multiplayer data');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    useEffect(() => {
        const fetchFriendsRooms = async () => {
            if (!token) {
                setFriendsRooms([]);
                return;
            }
            try {
                const res = await axios.get(`${API_BASE_URL}/api/rooms/friends-active`, {
                    headers: authHeaders
                });
                setFriendsRooms(Array.isArray(res.data) ? res.data : []);
            } catch (e) {
                setFriendsRooms([]);
            }
        };

        fetchFriendsRooms();
        const id = setInterval(fetchFriendsRooms, 8000);
        return () => clearInterval(id);
    }, [token]);

    const handleCreateRoom = async () => {
        if (!token) {
            alert('Please login to host a room');
            return;
        }
        if (!selectedGameId) {
            alert('Please select a game to host');
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/api/rooms/create`,
                { gameId: selectedGameId },
                { headers: authHeaders }
            );
            setCreatedRoom(res.data);
        } catch (e) {
            alert(e?.response?.data?.message || e.message || 'Failed to create room');
        }
    };

    const handleJoinRoom = async () => {
        if (!roomCode) return;
        if (!token) {
            alert('Please login to join a room');
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/api/rooms/join`,
                { roomCode },
                { headers: authHeaders }
            );
            navigate(`/room/${roomCode}`);
        } catch (e) {
            alert(e?.response?.data?.message || e.message || 'Failed to join room');
        }
    };

    const handleJoinFriendRoom = async (code) => {
        setRoomCode(code);
        try {
            await axios.post(`${API_BASE_URL}/api/rooms/join`,
                { roomCode: code },
                { headers: authHeaders }
            );
            navigate(`/room/${code}`);
        } catch (e) {
            alert(e?.response?.data?.message || e.message || 'Failed to join room');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
                <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Multiplayer Lobby</h2>

                {!user && (
                    <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-200 rounded-lg p-3 mb-4 text-sm">
                        Login to host rooms and to see your friends' room codes.
                    </div>
                )}

                {loading && (
                    <div className="text-gray-400 mb-4">Loading...</div>
                )}

                {!loading && error && (
                    <div className="text-red-400 mb-4">{error}</div>
                )}

                <div className="space-y-6">
                    {/* Create Room */}
                    <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600 border-dashed text-center">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Host a Game</h3>

                        <div className="mb-4">
                            <select
                                value={selectedGameId}
                                onChange={(e) => setSelectedGameId(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a game...</option>
                                {games.map((g) => (
                                    <option key={g._id} value={g._id}>
                                        {g.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {createdRoom ? (
                            <div className="animate-fade-in">
                                <p className="text-gray-400 text-sm mb-2">Share this code:</p>
                                <div className="text-4xl font-mono font-bold text-green-400 mb-4 tracking-wider select-all cursor-pointer bg-gray-900 p-2 rounded-lg">{createdRoom.roomCode}</div>
                                <button
                                    onClick={() => navigate(`/room/${createdRoom.roomCode}`)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Start Game
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleCreateRoom}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform active:scale-95"
                            >
                                Generate Room Code
                            </button>
                        )}
                    </div>

                    {/* Friends Hosting */}
                    <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Friends Hosting</h3>
                        {!user ? (
                            <div className="text-gray-400 text-sm">Login to see rooms hosted by your friends.</div>
                        ) : friendsRooms.length === 0 ? (
                            <div className="text-gray-400 text-sm">No active rooms from friends.</div>
                        ) : (
                            <div className="space-y-3">
                                {friendsRooms.map((r) => (
                                    <div key={r._id} className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="text-white font-semibold truncate">{r.host?.username} • {r.gameId?.title}</div>
                                            <div className="text-gray-400 text-xs font-mono">{r.roomCode}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleJoinFriendRoom(r.roomCode)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Join
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative flex items-center justify-center">
                        <hr className="w-full border-gray-600" />
                        <span className="absolute bg-gray-800 px-3 text-gray-400 text-sm">OR</span>
                    </div>

                    {/* Join Room */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Join a Friend</h3>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CODE"
                                className="flex-1 bg-gray-900 border border-gray-600 text-white text-center text-lg font-mono rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-wider p-3"
                            />
                            <button
                                onClick={handleJoinRoom}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-lg transition-colors"
                            >
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Room;
