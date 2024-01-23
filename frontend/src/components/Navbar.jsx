import { Link } from 'react-router-dom';

// if user is logged in I want Navbar to redirect to /posts:
// return isAuthenticated ? <Route path = "/" element={element} /> : <Navigate to="/users/login" />;
const Navbar = ({ user, logout }) => {
  return (
    <header className="Navbar">
      <Link to="/">
        <h1>My App</h1>
      </Link>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  );
};

export default Navbar;
