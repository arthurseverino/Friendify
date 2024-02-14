import { useState, useEffect, useRef } from 'react';
import PostDetails from '../components/PostDetails';
import { Link } from 'react-router-dom';

const Home = ({ userId, token, profilePicture }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
  const postRef = useRef(null);

  const scrollPosition = useRef(window.pageYOffset);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          setError('Failed to fetch user');
          console.error('Response not ok. Failed to fetch user');

          return;
        }
        const data = await response.json();
        setUser(data);

        const postsResponse = await fetch(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/users/${userId}/posts?page=${page}&limit=10`,
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

  // New useEffect for closing the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDialogOpen && !event.target.closest('.dialog-content')) {
        setIsDialogOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDialogOpen]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('body', postRef.current.value);
    formData.append('author', userId);
    if (postImage) {
      formData.append('image', postImage);
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}/posts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      // Add the new post to the posts array
      setPosts((prevPosts) => [data, ...prevPosts]);
      // Clear the textarea, the image input and close the dialog
      postRef.current.value = '';
      setPostImage(null);
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (isLoadMoreClicked) {
      window.scrollTo(0, scrollPosition.current);
      setIsLoadMoreClicked(false); // Reset isLoadMoreClicked to false
    }
  }, [posts, isLoadMoreClicked]);

  return (
    <div className="home">
      <h1 className="welcome-text">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          `Welcome, ${user ? user.username : ''}`
        )}
      </h1>

      <div className="home-header">
        <img
          className="profilePictureHome"
          src={profilePicture}
          alt="Profile Picture"
        />
        <button
          className="createPostButton"
          onClick={() => {
            setIsDialogOpen(true);
          }}>
          {`What's on your mind?`}
        </button>
      </div>

      <div className="home-content">
        <h2 className="your-feed">Your Feed </h2>

        {isDialogOpen && (
          <div
            className="modal-backdrop"
            onClick={() => setIsDialogOpen(false)}></div>
        )}

        <dialog className="create-post-dialog" open={isDialogOpen}>
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="createAPost">Create a Post</h3>
              <button
                className="close-button"
                onClick={() => setIsDialogOpen(false)}>
                X
              </button>
            </div>

            <form onSubmit={handleSubmitPost}>
              <textarea
                cols="55"
                rows="5"
                className="post-textarea"
                ref={postRef}
                placeholder={`What's on your mind, ${
                  user ? user.username : ''
                }?`}
                required
              />

              <h4 className="upload-photo"> Upload photo (optional) </h4>
              <div className="form-footer">
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setPostImage(e.target.files[0])}
                  accept="image/jpeg, image/png, image/gif, image/jpg"
                />
                <button type="submit" className="post-button">
                  Post
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {posts.length > 0 ? (
          posts.map((post) => (
            <PostDetails
              userId={userId}
              token={token}
              key={post._id}
              post={post}
            />
          ))
        ) : (
          <div>
            <p className="no-posts1">
              No posts from you or your friends yet...{' '}
            </p>
            <p className="no-posts2">Check out:</p>
            <p> </p>
            <Link to={`/api/users/${userId}/posts/allPosts`}>
              <button className="all-posts-button">All Posts</button>
            </Link>
            <Link to="/api/users">
              <button className="all-users-button">All Users</button>
            </Link>
          </div>
        )}
      </div>
      {hasMorePosts && posts.length >= 10 && (
        <button
          className="load-more-posts-button"
          onClick={() => {
            scrollPosition.current = window.pageYOffset;
            setPage(page + 1);
            setIsLoadMoreClicked(true); // Set isLoadMoreClicked to true
          }}
          disabled={isLoading}>
          {isLoading ? <div className="loader"></div> : 'Load More Posts'}
        </button>
      )}
    </div>
  );
};

export default Home;
