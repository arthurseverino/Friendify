import { useState, useEffect, useRef } from 'react';
import PostDetails from '../components/PostDetails';

const Home = ({ userId, token, profilePicture }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const postRef = useRef(null);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true); // Add this line
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

        const postsResponse = await fetch(
          `/api/users/${userId}/posts?page=${page}&limit=10`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!postsResponse.ok) {
          setError('Failed to fetch posts');
          console.error('Failed to fetch posts');
          setIsLoading(false); // Add this line
          return;
        }
        const postsData = await postsResponse.json();
        setPosts((prevPosts) => {
          const newPosts = postsData.filter(
            (post) => !prevPosts.find((p) => p._id === post._id)
          );
          return [...prevPosts, ...newPosts];
        });
        if (postsData.length < 10) {
          setHasMorePosts(false);
        }
      } catch (err) {
        console.error('Ultimately Failed in the try/catch');
      }
      setIsLoading(false); // Add this line
    };
    fetchUserAndPosts();
  }, [page]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('body', postRef.current.value);
    formData.append('author', userId);
    if (postImage) {
      formData.append('image', postImage);
    }

    const response = await fetch(`/api/users/${userId}/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('New post created', data);
      // Add the new post to the posts array
      setPosts((prevPosts) => [data, ...prevPosts]);
      // Clear the textarea, the image input and close the dialog
      postRef.current.value = '';
      setPostImage(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="home">
      <img
        className="profilePicture"
        src={profilePicture}
        alt="Profile Picture"
      />
      <h1>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          `Welcome, ${user ? user.username : ''}`
        )}
      </h1>
      <button
        className="createPostButton"
        onClick={() => {
          setIsDialogOpen(true);
        }}>
        {' '}
        + Create Post{' '}
      </button>
      <h2>Your Feed </h2>

      <dialog open={isDialogOpen}>
        <button onClick={() => setIsDialogOpen(false)}>Close</button>

        <form onSubmit={handleSubmitPost}>
          <textarea
            ref={postRef}
            placeholder={`What's on your mind, ${user ? user.username : ''}?`}
            required
          />
          <input
            type="file"
            onChange={(e) => setPostImage(e.target.files[0])}
          />
          <button type="submit">Post</button>
        </form>
      </dialog>

      {posts
        ? posts.map((post) => (
            <PostDetails
              userId={userId}
              token={token}
              key={post._id}
              post={post}
            />
          ))
        : 'No posts yet! Create a post or follow someone to see it here.'}
      {hasMorePosts && posts.length >= 10 && (
        <button onClick={() => setPage(page + 1)} disabled={isLoading}>
          {isLoading ? <div className="loader"></div> : 'Load More Posts'}
        </button>
      )}
    </div>
  );
};

export default Home;
