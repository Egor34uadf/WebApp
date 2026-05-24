import { useEffect } from 'react';

const PostModal = ({ post, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>
                <div className="p-6">
                    {/* ✅ Исправленный блок картинки */}
                    <img 
                        src={post.image || 'http://127.0.0.1:8000/media/default.jpg'}
                        alt={post.title}
                        className="w-full rounded-lg mb-4 object-cover max-h-96"
                        onError={(e) => {
                            e.target.src = 'http://127.0.0.1:8000/media/default.jpg';
                        }}
                    />
                    <div className="text-sm text-gray-500 mb-4">
                        Автор: {post.author || 'Неизвестен'} | {new Date(post.created_date).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;