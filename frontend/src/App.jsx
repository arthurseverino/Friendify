import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// pages
import Home from './pages/Home';

// components
import Navbar from './components/Navbar';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import Index from './pages/Index';

function App() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route path="/api/users/login" element={<LoginForm />} />
          <Route path="/api/posts" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
