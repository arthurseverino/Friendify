import { Link } from 'react-router-dom';

const Navbar = ({ logout, user }) => {
  return (
    <header className="Navbar">
      <Link to={user ? `/api/users/${user.id}/posts` : '/'}>
        <h1>My App</h1>
      </Link>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  );
};

export default Navbar;
