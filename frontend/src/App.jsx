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
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for user details
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/users/signup" element={<SignupForm />} />
          <Route path="/api/users/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/api/posts" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
