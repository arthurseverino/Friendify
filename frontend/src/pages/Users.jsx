import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch all users and set them in state
    const fetchUsers = async () => {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.error('Failed to follow user');
      return;
    }
  };

  return (
    <div className="users">
      {users.map((user) => (
        <div key={user._id}>
          <Link to={`/api/users/${user._id}`}>{user.username}</Link>
          {user.isFollowing ? (
            <button disabled>Following</button>
          ) : (
            <button onClick={() => handleFollow(user._id)}>Follow</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Users;
