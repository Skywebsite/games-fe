import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            to={`/play/${game.slug || game._id}`}
            className="block relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gray-800 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="aspect-w-16 aspect-h-9 relative">
                <img
                    src={isHovered && game.previewGif ? game.previewGif : game.thumbnail}
                    alt={game.title}
                    className="w-full h-48 object-cover object-center transition-opacity duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-6 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                        Play Now
                    </span>
                </div>
            </div>

            <div className="p-3 bg-gray-900">
                <h3 className="text-white font-semibold text-sm truncate">{game.title}</h3>
                <p className="text-gray-400 text-xs truncate">{game.category}</p>
            </div>
        </Link>
    );
};

export default GameCard;
