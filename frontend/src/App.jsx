import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    const isAuthenticated = localStorage.getItem('accessToken');

    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route 
                path="/profile" 
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;