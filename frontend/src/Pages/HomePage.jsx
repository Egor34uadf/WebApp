import { useState, useEffect } from 'react';
import PostModal from '../components/PostModal';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://127.0.0.1:8000/api/posts/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Ошибка загрузки статей');
            
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Загрузка статей...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Лента статей
                </h1>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                {posts.length === 0 && !error && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">Пока нет статей. Создайте первую!</p>
                        <a href="/create" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Создать статью
                        </a>
                    </div>
                )}

                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {post.content}
                            </p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Автор: {post.author || 'Неизвестен'}</span>
                                <span>{new Date(post.created_date).toLocaleDateString('ru-RU')}</span>
                            </div>
                            <button
                                onClick={() => setSelectedPost(post)}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Читать далее →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedPost && (
                <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
            )}
        </div>
    );
};

export default HomePage;