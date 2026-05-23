import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('users/me/');
                setUser(res.data);
            } catch (err) {
                console.error('Доступ запрещен', err);
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                Загрузка...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Личный кабинет
                </h1>

                <div className="space-y-4">
                    <div className="border-b pb-3">
                        <p className="text-gray-500 text-sm">Имя пользователя</p>
                        <p className="text-gray-800 font-medium">{user.username}</p>
                    </div>
                    <div className="border-b pb-3">
                        <p className="text-gray-500 text-sm">Email</p>
                        <p className="text-gray-800 font-medium">{user.email || 'Не указан'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;  