import { useState } from 'react';
import api from '../api';

const FavoriteButton = ({ postId, initialIsFavorited, onToggle }) => {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [loading, setLoading] = useState(false);

    const handleFavorite = async () => {
        if (loading) return;
        setLoading(true);
        
        try {
            const response = await api.post(`posts/${postId}/favorite/`);
            const newStatus = response.data.status === 'favorited';
            setIsFavorited(newStatus);
            if (onToggle) onToggle(postId, newStatus);
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFavorite}
            disabled={loading}
            className={`text-xl transition ${
                isFavorited ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
        >
            {isFavorited ? '⭐' : '☆'}
        </button>
    );
};

export default FavoriteButton;