import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                            Главная
                        </Link>
                        <Link to="/create" className="text-gray-700 hover:text-blue-600 font-medium transition">
                            Новая статья
                        </Link>
                        <Link to="/favorites" className="text-gray-700 hover:text-blue-600 font-medium transition">
                            Избранное ⭐
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition">
                            Профиль
                        </Link>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;