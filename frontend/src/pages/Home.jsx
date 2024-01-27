import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';
import { useParams } from 'react-router-dom';

const Home = ({ token, user}) => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${user.id}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        setError('Failed to fetch posts');
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <h1>Home</h1>
      <h1>{`Hi, ${user.firstName}`}</h1>
      <h2>My Timeline: </h2>
      <button
        className="createPostButton"
        onClick={() => {
          'Dialog or new page?';
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
