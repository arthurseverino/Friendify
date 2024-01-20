import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages & components
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" component={SignupComponent} />
            <Route path="/login" component={LoginComponent} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
