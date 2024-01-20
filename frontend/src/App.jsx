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
        <div className="pages">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/posts" element={<Home />} />
            <Route path="/users/signup" element={<SignupForm />} />
            <Route path="/users/login" element={<LoginForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
