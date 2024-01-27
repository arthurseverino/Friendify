import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';

const Home = ({ token, userId }) => {
  const [posts, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  //only ran once when Home is rendered, because of the empty array
  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view this page');
      return;
    }
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

    //you get the user through the database with its userId
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        console.log('Data of user that is logged in: ', user);
      } else {
        setError('Failed to fetch user');
      }
    };
    fetchUser();
    console.log('User: ', user);
  }, [userId, token]);

  return (
    <div className="home">
      <h1>Home</h1>
      <h1>{user ? `Hi, ${user.firstName}` : 'Loading...'}</h1>
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
