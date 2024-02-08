import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Users = ({ token, currentUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users and set them in state
    const fetchUsers = async () => {
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch users');
        return;
      }
      const data = await response.json();
      setUsers(data);
    };
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
      return <p>(Current User)</p>;
    } else if (user.isFollowing) {
      return <button disabled>Following</button>;
    }
    return <button onClick={() => handleFollow(user._id)}>Follow</button>;
  };

  return (
    <div className="users">
      <h1> All Users </h1>
      {users.map((user) => (
        <div key={user._id}>
          <Link to={`/api/users/${user._id}`}>
            <img
              className="profilePicture"
              src={user.profilePicture}
              alt="Profile Picture"
            />
            {user.username}
          </Link>
          {renderButton(user)}
        </div>
      ))}
    </div>
  );
};

export default Users;
