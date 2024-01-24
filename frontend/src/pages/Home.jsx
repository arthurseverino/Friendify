import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';
import { useNavigate } from 'react-router-dom';

const Home = ({token, userId}) => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //only ran once when Home is rendered, because of the empty array
  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view this page');
      return;
    }
    const fetchPosts = async () => {
      const response = await fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Failed to fetch posts');
      }
    };
    fetchPosts();

    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setUser(data);
      } else {
        setError('Failed to fetch user');
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="home">
      <h1>{user ? `Hi, ${user.firstName}` : 'Loading...'}</h1>
      <h2>My Timeline: </h2>
      <button
        onClick={() => {
          navigate('/api/posts');
        }}>
        {' '}
        + Create Post{' '}
      </button>
      {error && <div>Error: {error}</div>}
      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet! Create or follow someone one to see it here.'}
    </div>
  );
};

export default Home;
