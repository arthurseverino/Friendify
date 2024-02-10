import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// You can use a state for the entire post and update it when the like button is clicked or a comment is added.
const PostDetails = ({ post: initialPost, userId, token }) => {
  const [post, setPost] = useState(initialPost);
  const [comment, setComment] = useState({});

  async function handleLike() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}/posts/${post._id}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Update handleComment to use post._id
  async function handleComment(e, postId) {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: comment[postId] }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setPost(data.post);
      // Reset the comment input for this post
      setComment((prevComments) => ({ ...prevComments, [postId]: '' }));
    }
  }

  if (!post.author) {
    return null;
  }

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/api/users/${post.author._id}`}>
          <img
            className="profilePicturePost"
            src={post.author.profilePicture}
            alt="Profile Picture"
          />
          <span className="post-username">{post.author.username}</span>
        </Link>
      </div>
      <p className="post-body">{post.body}</p>
      {post.image && (
        <img
          className="postImage"
          src={`${import.meta.env.VITE_APP_API_URL}/${post.image}`}
          alt="Post Image"
        />
      )}
      <div className="post-stats">
        <p>
          {post.likes &&
            post.likes.length > 0 &&
            `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}`}
        </p>
        {post.comments && post.comments.length > 0 && (
          <p>
            {post.comments.length === 1
              ? '1 comment'
              : `${post.comments.length} comments`}
          </p>
        )}
      </div>
      <hr />
      <div className="post-actions">
        <div className="likes">
          <button
            className={
              post.likes.includes(userId) ? 'liked' : 'post-like-button'
            }
            onClick={handleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              fill="currentColor"
              width="21"
              height="21">
              <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
            </svg>
            Like
          </button>
        </div>
        <div className="comments">
          <button
            className="post-comment-button-above"
            type="submit"
            form={`comment-form-${post._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              fill="currentColor"
              width="20"
              height="20">
              <path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" />
            </svg>
            Comment
          </button>
        </div>
      </div>
      <hr />
      <form
        id={`comment-form-${post._id}`}
        className="comment-form"
        onSubmit={(e) => handleComment(e, post._id)}>
        <div className="comment-input-container">
          <input
            className="comment-input"
            type="text"
            value={comment[post._id] || ''}
            onChange={(e) =>
              setComment((prevComments) => ({
                ...prevComments,
                [post._id]: e.target.value,
              }))
            }
            placeholder="Write a comment..."
            required
          />
          <button className="post-comment-button-below" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              fill="currentColor"
              width="23"
              height="23">
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </button>
        </div>
      </form>
      {post.comments.map(
        (comment) =>
          comment.author && (
            <div key={comment._id} className="comment">
              <Link to={`/api/users/${comment.author._id}`}>
                <img
                  className="profilePicture-comment"
                  src={comment.author.profilePicture}
                  alt="Profile Picture"
                />
                <span className="comment-author">
                  {comment.author.username}
                </span>
              </Link>
              <p className="comment-text">{comment.text}</p>
            </div>
          )
      )}
    </div>
  );
};

export default PostDetails;
