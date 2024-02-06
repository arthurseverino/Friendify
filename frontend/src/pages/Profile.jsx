import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostDetails from '../components/PostDetails';

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const userResponse = await fetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await userResponse.json();
      setUser(userData);

      const postsResponse = await fetch(`/api/users/${id}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const postsData = await postsResponse.json();
      setPosts(postsData);

      setLoading(false);
    };

    fetchUserAndPosts();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h1> MY PROFILE </h1>
      <h2> Username: {user.username}</h2>
      {posts.length > 0 ? (
        posts.map((post) => <PostDetails key={post._id} post={post} />)
      ) : (
        <p>No posts yet!</p>
      )}
    </div>
  );
}

export default Profile;