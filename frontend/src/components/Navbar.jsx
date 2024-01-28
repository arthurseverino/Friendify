import { Link } from 'react-router-dom';

const Navbar = ({ logout, userId }) => {
  return (
    <header className="Navbar">
      <Link to={userId ? `/api/users/${userId}/posts` : '/'}>
        <h1>My App</h1>
      </Link>
      { userId && <button onClick={logout}>Logout</button>}
    </header>
  );
};

export default Navbar;
