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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 transform transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Browser Notice</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Some games may not work properly in Brave. For the best experience, we recommend using Chrome.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={dismissBraveWarning}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={dismissBraveWarning}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Continue in Brave
                    </button>
                    <a
                      href="https://www.google.com/chrome/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                    >
                      Open Chrome
                    </a>
                  </div>
                </div>
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
