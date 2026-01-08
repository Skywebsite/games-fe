import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Play from './pages/Play';
import Room from './pages/Room';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [showBraveWarning, setShowBraveWarning] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowLoader(false), 3500);
    // Detect Brave browser
    if (navigator.brave) {
      setShowBraveWarning(true);
    }
    return () => clearTimeout(id);
  }, []);

  const dismissBraveWarning = () => setShowBraveWarning(false);

  if (showLoader) {
    return (
      <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="w-64 h-64">
          <DotLottieReact
            src="https://lottie.host/9f955225-7222-49af-9a30-307945e05bbb/eiAkYXQ0cI.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-dark-bg text-dark-text font-sans">
            {showBraveWarning && (
              <div className="bg-yellow-600 text-white text-center py-2 px-4 text-sm relative">
                <span>
                  Some games may not work properly in Brave. For the best experience, use Chrome.
                </span>
                <button
                  onClick={dismissBraveWarning}
                  className="absolute right-2 top-1/2 -translate-y-1/2 ml-4 text-white hover:text-gray-200"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play/:slug" element={<Play />} />
              <Route path="/multiplayer" element={<Room />} />
              <Route path="/room/:roomCode" element={<div className="text-white text-center mt-10">Room Interface (Coming Soon)</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
