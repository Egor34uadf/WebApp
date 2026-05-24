import { useState } from 'react';
import api from '../api';

const LikeButton = ({ postId, initialLikesCount, initialIsLiked }) => {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;
        setLoading(true);
        
        try {
            const response = await api.post(`posts/${postId}/like/`);
            setLikesCount(response.data.likes_count);
            setIsLiked(response.data.status === 'liked');
        } catch (error) {
            console.error('Ошибка при лайке:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-1 transition ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
        >
            <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
            <span className="text-sm">{likesCount}</span>
        </button>
    );
};

export default LikeButton;