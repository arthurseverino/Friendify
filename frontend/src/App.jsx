import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// pages
import Home from './pages/Home';
import Users from './pages/Users';
import Profile from './pages/Profile';
import AllPosts from './pages/AllPosts';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import Index from './pages/Index';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem('profilePicture') === 'null'
      ? null
      : localStorage.getItem('profilePicture') ||
          `${import.meta.env.VITE_APP_API_URL}/public/profilePic.jpg`
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
    // Define an async function inside the effect
    const wakeUpServer = async () => {
      try {
        const response = await fetch('/');

        if (response.ok) {
          setIsLoading(false);
        } else {
          throw new Error('Server responded with an error');
        }
      } catch (error) {
        setError(error.message); // Set the error state variable
      }
    };

    // Call the async function
    wakeUpServer();
  }, [token, userId, profilePicture]);

  if (isLoading) {
    return (
      <div>
        <p>Waking up the server, please wait a few seconds...</p>
        <div className="loader"></div>
      </div>
    );
  }

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
            setProfilePicture={setProfilePicture}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Index
                setProfilePicture={setProfilePicture}
                setToken={setToken}
                setUserId={setUserId}
                userId={userId}
                token={token}
              />
            }
          />
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
          <Route
            path="/api/users/signup"
            element={<SignupForm userId={userId} token={token} />}
          />
          <Route
            path="/api/users/login"
            element={
              <LoginForm
                setToken={setToken}
                setUserId={setUserId}
                setProfilePicture={setProfilePicture}
                userId={userId}
                token={token}
              />
            }
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
      <Footer />
    </div>
  );
}

export default App;
