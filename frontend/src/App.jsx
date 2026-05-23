import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import Navbar from './components/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Загрузка...</div>
            </div>
        );
    }

    return (
        <>
            {isAuthenticated && <Navbar onLogout={handleLogout} />}
            <Routes>
                <Route 
                    path="/login" 
                    element={!isAuthenticated ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" />} 
                />
                <Route 
                    path="/" 
                    element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/profile" 
                    element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/create" 
                    element={isAuthenticated ? <CreatePage /> : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;