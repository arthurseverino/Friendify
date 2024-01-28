import { useState, useEffect } from 'react';
import PostDetails from '../components/PostDetails';
import { useParams } from 'react-router-dom';

const Home = ({ isLoading }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      const fetchUserAndPosts = async () => {
        try {
          const userId = localStorage.getItem('userId');
          const token = localStorage.getItem('token');
          if (!userId || !token) {
            setError('No user ID or token in local storage');
            console.error('No user ID or token in local storage');
            return;
          }
          const response = await fetch(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`Authorization: Bearer ${token} in Home.jsx`);
          if (!response.ok) {
            setError('Failed to fetch user');
            console.error('Response not ok. Failed to fetch user');
            return;
          }
          const data = await response.json();
          setUser(data);

          const postsResponse = await fetch(`/api/users/${userId}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
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
    }
  }, [isLoading]);

  return (
    <div className="home">
      <h1>Home</h1>
      <h1>{user ? `Hi there, ${user.firstName}` : 'Loading...'}</h1>
      <h2>My Timeline: </h2>
      <button
        className="createPostButton"
        onClick={() => {
          console.log('Open a textbox here to create a post');
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
