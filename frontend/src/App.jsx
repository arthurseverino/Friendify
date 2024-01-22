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
          <Route path="/index" element={<Index />} />
          <Route path="/users/signup" element={<SignupForm />} />
          <Route path="/users/login" element={<LoginForm />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
