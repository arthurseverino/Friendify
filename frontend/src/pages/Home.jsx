import { useState, useEffect, useRef } from 'react';
import PostDetails from '../components/PostDetails';
import { useParams } from 'react-router-dom';

const Home = ({ isLoading }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const postRef = useRef(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isLoading) {
      const fetchUserAndPosts = async () => {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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
          setPosts(postsData);
        } catch (err) {
          console.error('Ultimately Failed in the try/catch');
        }
      };
      fetchUserAndPosts();
    }
  }, [isLoading]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    const newPost = {
      body: postRef.current.value,
      likes: 0,
      comments: [],
      author: userId,
    };

    const response = await fetch(`/api/users/${userId}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      const data = await response.json();
      console.error('Failed to create post', data);
      return;
    }

    const data = await response.json();
    console.log('New post created', data);
    // Add the new post to the posts array
    setPosts((prevPosts) => [data, ...prevPosts]);

    // Clear the textarea and close the dialog
    postRef.current.value = '';
    setIsDialogOpen(false);
  };

  return (
    <div className="home">
      <h1>Home</h1>
      <h1>{user ? `Hi there, ${user.firstName}` : 'Loading...'}</h1>
      <h2>My Timeline: </h2>

      <button
        className="createPostButton"
        onClick={() => {
          setIsDialogOpen(true);
        }}>
        {' '}
        + Create Post{' '}
      </button>

      <dialog open={isDialogOpen}>
        <button onClick={() => setIsDialogOpen(false)}>Close</button>

        <form onSubmit={handleSubmitPost}>
          <textarea
            ref={postRef}
            placeholder={`What's on your mind, ${user ? user.firstName : ''}?`}
            required
          />
          <button type="submit">Post</button>
        </form>
      </dialog>

      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet! Create a post or follow someone to see it here.'}
    </div>
  );
};

export default Home;
