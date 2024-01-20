import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';

// Home page once logged in
const Home = () => {
  const [posts, setPosts] = useState(null);

  //only ran once when Home is rendered, because of the empty array
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <h1>My Timeline</h1>
      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet'}
    </div>
  );
};

export default Home;
