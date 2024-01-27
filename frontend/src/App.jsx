import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// pages
import Home from './pages/Home';

// components
import Navbar from './components/Navbar';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import Index from './pages/Index';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const token = localStorage.getItem('token');

  // if user is in LocalStorage, then the user is logged in so set them to the Current User
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userId');
    if (userLoggedIn) {
      setCurrentUserId(userLoggedIn);
      console.log('Current User Id in App.jsx: ', currentUserId);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} userId={currentUserId} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route path="/api/users/login" element={<LoginForm />} />
          <Route
            path={`/api/users/:userId/posts`}
            element={<Home token={token}/>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
