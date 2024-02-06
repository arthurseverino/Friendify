import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
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

function Redirector({ isLoading }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userLoggedInId = localStorage.getItem('userId');

  useEffect(() => {
    if (!isLoading && userLoggedInId && location.pathname === '/') {
      navigate(`/api/users/${userLoggedInId}/posts`);
    }
  }, [navigate, userLoggedInId, isLoading, location]);

  return null;
}

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // if user is in LocalStorage, then the user is logged in so set them to the Current User
  // redirect them to their posts page but I get unauthorized
  useEffect(() => {
    const userLoggedInId = localStorage.getItem('userId');
    if (userLoggedInId) {
      setCurrentUserId(userLoggedInId);
      setToken(localStorage.getItem('token'));
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Render a loading message while the app is in loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} userId={currentUserId} key={currentUserId} />
        <Redirector isLoading={isLoading} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users" element={<Users />} />
          <Route path="/api/users/:id" element={<Profile />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route path="/api/users/login" element={<LoginForm />} />
          <Route
            path={`/api/users/:userId/posts`}
            element={<Home isLoading={isLoading} />}
          />
          <Route
            path="/api/users/:userId/posts/allPosts"
            element={<AllPosts />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
