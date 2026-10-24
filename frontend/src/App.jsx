import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import CommandPalette from './components/common/CommandPalette';

import Home from './pages/Home';
import Discover from './pages/Discover';
import Trending from './pages/Trending';
import Upcoming from './pages/Upcoming';
import GameDetails from './pages/GameDetails';
import Community from './pages/Community';
import ThreadDetail from './pages/ThreadDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import DeveloperDashboard from './pages/DeveloperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

import './styles/globals.css';

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
            <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
            <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/games/:slug" element={<GameDetails />} />

              <Route path="/community" element={<Community />} />
              <Route path="/games/:slug/threads/:threadId" element={<ThreadDetail />} />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile/:username" element={<Profile />} />

              <Route
                path="/developer"
                element={
                  <ProtectedRoute allowedRoles={['developer', 'admin']}>
                    <DeveloperDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ModalProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}
