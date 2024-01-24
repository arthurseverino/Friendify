import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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

  let decodedToken;
  let userId;
  const token = localStorage.getItem('token');
  if (token) {
    decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log('userId of user that is currently logged in: ', userId);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} isLoggedIn={token} userId={userId} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route
            path="/api/users/login"
            element={<LoginForm userId={userId} />}
          />
          <Route
            path={`/api/users/${userId}/posts`}
            element={<Home token={token} userId={userId} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
