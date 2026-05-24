import { useState, useEffect } from 'react';
import api from '../api';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('-created_date'); // -created_date, title, -title

    const fetchFavorites = async () => {
        try {
            const response = await api.get(`favorites/?ordering=${sortBy}`);
            setFavorites(response.data);
        } catch (error) {
            console.error('Ошибка загрузки избранного:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [sortBy]);

    const handleRemoveFromFavorites = async (postId) => {
        try {
            await api.post(`posts/${postId}/favorite/`);
            setFavorites(favorites.filter(fav => fav.post.id !== postId));
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
        }
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setLoading(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Избранные статьи ⭐
                    </h1>
                    
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="-created_date">Новые первые</option>
                        <option value="created_date">Старые первые</option>
                        <option value="title">По алфавиту (А-Я)</option>
                        <option value="-title">По алфавиту (Я-А)</option>
                    </select>
                </div>

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">У вас пока нет избранных статей</p>
                        <a href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
                            Перейти к ленте статей →
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {favorites.map((fav) => (
                            <div key={fav.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                {fav.post.image && (
                                    <img 
                                        src={`http://127.0.0.1:8000${fav.post.image}`}
                                        alt={fav.post.title}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                        onError={(e) => {
                                            e.target.src = 'http://127.0.0.1:8000/media/default.jpg';
                                        }}
                                    />
                                )}
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    {fav.post.title}
                                </h2>
                                <p className="text-gray-600 mb-2 line-clamp-2">
                                    {fav.post.content}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                                    <span>Автор: {fav.post.author || 'Неизвестен'}</span>
                                    <span>Добавлено: {new Date(fav.created_date).toLocaleDateString('ru-RU')}</span>
                                </div>
                                <div className="flex space-x-4">
                                    <a 
                                        href={`/post/${fav.post.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = '/';
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Читать →
                                    </a>
                                    <button
                                        onClick={() => handleRemoveFromFavorites(fav.post.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Удалить из избранного
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;