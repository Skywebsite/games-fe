import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://games-be.vercel.app';

const Profile = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setProfile(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(res.data);
            } catch (e) {
                setProfile(null);
                setError(e?.response?.data?.message || e.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Profile</h1>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-gray-300">
                        Please login to view your profile.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xl">
                            {(user?.username || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{user?.username}</div>
                            <div className="text-gray-400 text-sm">{user?.email}</div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-gray-400">Loading profile...</div>
                )}

                {!loading && error && (
                    <div className="text-red-400">{error}</div>
                )}

                {!loading && !error && profile && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Friends</h2>

                            {(!profile.friends || profile.friends.length === 0) ? (
                                <div className="text-gray-400">No friends yet.</div>
                            ) : (
                                <div className="space-y-3">
                                    {profile.friends.map((f) => (
                                        <div key={f._id} className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg p-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                                                {(f.username || 'U')[0].toUpperCase()}
                                            </div>
                                            <div className="text-white font-medium">{f.username}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Recently Played</h2>

                            {(!profile.recentlyPlayed || profile.recentlyPlayed.length === 0) ? (
                                <div className="text-gray-400">No recently played games.</div>
                            ) : (
                                <div className="space-y-3">
                                    {profile.recentlyPlayed.map((item, idx) => {
                                        const g = item.game;
                                        if (!g) return null;

                                        return (
                                            <Link
                                                key={`${g._id}-${idx}`}
                                                to={`/play/${g.slug || g._id}`}
                                                className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg p-3 hover:border-gray-500 transition-colors"
                                            >
                                                <img src={g.thumbnail} alt={g.title} className="w-16 h-12 object-cover rounded-md border border-gray-700" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-white font-medium truncate">{g.title}</div>
                                                    <div className="text-gray-400 text-xs truncate">{g.category}</div>
                                                </div>
                                                <div className="text-gray-500 text-xs whitespace-nowrap">
                                                    {item.playedAt ? new Date(item.playedAt).toLocaleString() : ''}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
