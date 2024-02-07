import { Link } from 'react-router-dom';

const Navbar = ({userId}) => {

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <header className="Navbar">
      <Link to={`/api/users/${userId}/posts`}>
        <h1>Odinbook</h1>
      </Link>
      <Link to={`/api/users/${userId}`}>Profile</Link>
      <Link to="/api/users">Users</Link>
      <Link to={`/api/users/${userId}/posts/allPosts`}>All Posts</Link>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Navbar;
