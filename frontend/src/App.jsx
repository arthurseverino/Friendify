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
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if user details are in local storage, 
    // if true, that means the user is logged in, set that to the Current User
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logout={logout} userId={user?.id} />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route path="/api/users/login" element={<LoginForm />} />
          <Route
            path={`/api/users/:userId/posts`}
            element={<Home token={token} user={user} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
