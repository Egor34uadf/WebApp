import { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch('http://127.0.0.1:8000/api/users/me/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Ошибка загрузки профиля');
                
                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Загрузка...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-600">Ошибка загрузки профиля</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-md">
                <div className="bg-white rounded-lg shadow-md p-8">
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
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;