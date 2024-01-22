import { Link } from 'react-router-dom';

// if user is logged in I want Navbar to redirect to /posts:
// return isAuthenticated ? <Route path = "/" element={element} /> : <Navigate to="/users/login" />;
const Navbar = () => {
  return (
    <header className="Navbar">
      <Link to="/">
        <h1>My App</h1>
      </Link>
      <Link to="/api/users/logout">
        <h2>Logout</h2>
      </Link>
    </header>
  );
};

export default Navbar;
