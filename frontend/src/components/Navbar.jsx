import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({
  userId,
  setToken,
  setUserId,
  token,
  profilePicture,
  setProfilePicture,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setProfilePicture(null);
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={`/api/users/${userId}/posts`}>
          <h1>Friendify</h1>
        </Link>
        <Link to={`/api/users/${userId}/posts`}>Home</Link>
        <Link to="/api/users">Users</Link>
        <Link to={`/api/users/${userId}/posts/allPosts`}>All Posts</Link>
      </div>
      <div className="navbar-right">
        <Link to={`/api/users/${userId}`}>
          <img
            className="profilePicture"
            src={profilePicture}
            alt="Profile Picture"
          />
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
