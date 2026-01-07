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

  useEffect(() => {
    const id = setTimeout(() => setShowLoader(false), 3500);
    return () => clearTimeout(id);
  }, []);

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
