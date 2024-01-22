import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';

// Home page once logged in
const Home = () => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);

  //only ran once when Home is rendered, because of the empty array
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/');
      const data = await response.json();
      if (response.ok) {
        setPosts(data);
      }
    };
    fetchPosts();

    const fetchUser = async () => {
      const response = await fetch('/users/:id');
      const data = await response.json();
      if (!data.error) {
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="home">
      <h1>My Timeline</h1>
      <h3>{`Hi, ${user.firstName}`}</h3>
      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet'}
    </div>
  );
};

export default Home;
