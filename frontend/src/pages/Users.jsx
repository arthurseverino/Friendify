import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Users = ({ token, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch all users and set them in state
    const fetchUsers = async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch users');
        setIsLoading(false); // Add this line
        return;
      }
      const data = await response.json();
      setUsers(data);
    };
    setIsLoading(false); // Add this line
    fetchUsers();
  }, []);

  const handleFollow = async (userIdToFollow) => {
    // Follow the user
    const response = await fetch(`/api/users/${userIdToFollow}/follow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      console.error('Failed to follow user');
      return;
    }

    // Update the following state of the current user and the isFollowing state of the followed user
    setUsers((users) =>
      users.map((user) => {
        if (user._id === currentUserId) {
          return { ...user, following: [...user.following, userIdToFollow] };
        } else if (user._id === userIdToFollow) {
          return { ...user, isFollowing: true };
        }
        return user;
      })
    );
  };

  const renderButton = (user) => {
    if (user._id === currentUserId) {
      return <p className= "current-user">(Current User)</p>;
    } else if (user.isFollowing) {
      return <button className = "users-follow" disabled>Following</button>;
    }
    return <button className = "users-follow" onClick={() => handleFollow(user._id)}>Follow</button>;
  };

  return (
    <div className="users">
      <h1 className = "users-text"> All Users </h1>
      <div className="users-list">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-item">
              <Link to={`/api/users/${user._id}`}className = "users-link">
                <img
                  className="profilePictureUsers"
                  src={user.profilePicture}
                  alt="Profile Picture"
                />
                <div className="username">{user.username}</div>
              </Link>
              {renderButton(user)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
