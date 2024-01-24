import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

// pages
import Home from './pages/Home';

// components
import Navbar from './components/Navbar';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import Index from './pages/Index';

function Navigation({ token, userId }) {
  const navigate = useNavigate();

  // redirect to posts page if user is logged in
  useEffect(() => {
    if (token) {
      navigate(`/api/users/${userId}/posts`);
    }
  }, [token, navigate, userId]);

  return null;
}

function App() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  const token = localStorage.getItem('token');
  //log user out automatically after an hour after logging in
  setTimeout(() => localStorage.removeItem('token'), 60 * 60 * 1000);
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id;

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} isLoggedIn={token} userId={userId} />
        <Navigation token={token} userId={userId} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route
            path="/api/users/login"
            element={<LoginForm token={token} userId={userId} />}
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
