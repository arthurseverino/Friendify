import { BrowserRouter, Routes, Route, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

// pages
import Home from './pages/Home';

// components
import Navbar from './components/Navbar';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import Index from './pages/Index';

function App() {
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  const token = localStorage.getItem('token');
  //log user out automatically after an hour 
  setTimeout(() => localStorage.removeItem('token'), 5 * 60 * 1000);
  const decodedToken = jwt_decode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    if (token) {
      history.push('/api/posts');
    }
  }, [itoken, history]);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} isLoggedIn={token} userId={userId} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route path="/api/users/login" element={<LoginForm />} />
          <Route
            path="/api/posts"
            element={<Home token={token} userId={userId} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
