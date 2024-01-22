import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';

const Home = () => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  //only ran once when Home is rendered, because of the empty array
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Failed to fetch posts');
      }
    };
    fetchPosts();

    const fetchUser = async () => {
      const response = await fetch('/api/users/:id');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setError('Failed to fetch user');
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="home">
      <h1>My Timeline</h1>
      <h3>{`Hi, ${user.firstName}`}</h3>
      {error && <div>Error: {error}</div>}
      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet! Create or follow someone one to see it here.'}
    </div>
  );
};

export default Home;
