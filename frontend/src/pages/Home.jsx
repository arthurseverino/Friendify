import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';
import { useParams } from 'react-router-dom';

const Home = ({ token }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No user ID in local storage');
          console.error('No user ID in local storage');
          return;
        }
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('response in Home.jsx: ', response);
        if (!response.ok) {
          setError('Failed to fetch user');
          console.error('Response not ok. Failed to fetch user');
          return;
        }
        const data = await response.json();
        setUser(data);

        const postsResponse = await fetch(`/api/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!postsResponse.ok) {
          setError('Failed to fetch posts');
          console.error('Failed to fetch posts');
          return;
        }
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
      } catch (err) {
        console.error('Ultimately Failed in the try/catch');
      }
    };
    fetchUserAndPosts();
  }, []);

  return (
    <div className="home">
      <h1>Home</h1>
      <h1>{user ? `Hii, ${user.firstName}` : 'Loading...'}</h1>
      <h2>My Timeline: </h2>
      <button
        className="createPostButton"
        onClick={() => {
          'Open a textbox here to create a post';
        }}>
        {' '}
        + Create Post{' '}
      </button>
      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet! Create a post or follow someone one to see it here.'}
    </div>
  );
};

export default Home;
