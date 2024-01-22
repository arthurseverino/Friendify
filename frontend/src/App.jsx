import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Home from './pages/Home';

// components
import Navbar from './components/Navbar';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import Index from './pages/Index';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
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
