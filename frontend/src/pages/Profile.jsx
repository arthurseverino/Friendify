import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h2>{user.username}</h2>
      {user.posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;
