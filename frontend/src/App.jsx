import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// pages
import Home from './pages/Home';
import Users from './pages/Users';
import Profile from './pages/Profile';
import AllPosts from './pages/AllPosts';
import LoginForm from './pages/LoginForm';
import Index from './pages/Index';

// components
import Navbar from './components/Navbar';
import SignupForm from './pages/SignupForm';

function App() {
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem('profilePicture') ||
      import.meta.env.VITE_DEFAULT_PROFILE_PICTURE
  );

  const [token, setToken] = useState(
    localStorage.getItem('token') === 'null'
      ? null
      : localStorage.getItem('token')
  );
  const [userId, setUserId] = useState(
    localStorage.getItem('userId') === 'null'
      ? null
      : localStorage.getItem('userId')
  );
  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('profilePicture', profilePicture);
  }, [token, userId, profilePicture]);

  return (
    <div className="App">
      <HashRouter>
        {token && (
          <Navbar
            token={token}
            setToken={setToken}
            setUserId={setUserId}
            userId={userId}
            profilePicture={profilePicture}
          />
        )}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/api/users"
            element={<Users currentUserId={userId} token={token} />}
          />
          <Route
            path="/api/users/:id"
            element={
              <Profile
                userId={userId}
                token={token}
                setProfilePicture={setProfilePicture}
              />
            }
          />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route
            path="/api/users/login"
            element={<LoginForm setToken={setToken} setUserId={setUserId} />}
          />
          <Route
            path={`/api/users/:userId/posts`}
            element={
              <Home
                userId={userId}
                token={token}
                profilePicture={profilePicture}
              />
            }
          />
          <Route
            path="/api/users/:userId/posts/allPosts"
            element={
              <AllPosts
                userId={userId}
                token={token}
                profilePicture={profilePicture}
              />
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
