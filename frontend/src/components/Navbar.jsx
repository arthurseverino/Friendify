import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userId, setToken, setUserId, token, profilePicture }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <header className="Navbar">
      <Link to={`/api/users/${userId}`}>
        <img
          className="profilePicture"
          src={profilePicture}
          alt="Profile Picture"
        />
      </Link>
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
