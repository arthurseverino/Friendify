import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ userId, setToken, setUserId, token }) => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProfilePicture(data.profilePicture);
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

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
      <img
        className="profilePicture"
        src={profilePicture}
        alt="Profile Picture"
      />
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
