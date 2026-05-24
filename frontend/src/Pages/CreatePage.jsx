import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [useDefaultImage, setUseDefaultImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Обработчик выбора файла
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Если выбрали свой файл — отключаем чекбокс "по умолчанию"
            setUseDefaultImage(false);
        }
    };

    // Обработчик чекбокса
    const handleDefaultImageChange = (e) => {
        const isChecked = e.target.checked;
        setUseDefaultImage(isChecked);
        if (isChecked) {
            // Если включили "по умолчанию" — убираем свой файл
            setImage(null);
            // Очищаем поле выбора файла
            const fileInput = document.getElementById('imageInput');
            if (fileInput) fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        
        // Если выбрано "по умолчанию" — не отправляем изображение
        if (!useDefaultImage && image) {
            formData.append('image', image);
        }
        // Если useDefaultImage === true — поле image не добавляем (будет null в БД, и на фронте покажется дефолтная картинка)

        try {
            await api.post('posts/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/');
        } catch (err) {
            setError('Ошибка создания статьи');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Создать новую статью
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Заголовок
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Содержание
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="8"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Чекбокс "Фото по умолчанию" */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="useDefaultImage"
                                checked={useDefaultImage}
                                onChange={handleDefaultImageChange}
                                disabled={loading || image !== null}
                                className="w-5 h-5 text-blue-600"
                            />
                            <label htmlFor="useDefaultImage" className="text-gray-700 font-medium">
                                Использовать фото по умолчанию
                            </label>
                        </div>

                        {/* Поле загрузки файла */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Или загрузите своё изображение
                            </label>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading || useDefaultImage}
                                className="w-full"
                            />
                            {image && (
                                <p className="text-sm text-green-600 mt-1">
                                    ✓ Выбран файл: {image.name}
                                </p>
                            )}
                            {useDefaultImage && (
                                <p className="text-sm text-gray-500 mt-1">
                                    🔘 Будет использовано фото по умолчанию
                                </p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {loading ? 'Публикация...' : 'Опубликовать'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;