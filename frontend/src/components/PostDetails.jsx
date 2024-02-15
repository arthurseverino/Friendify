import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// You can use a state for the entire post and update it when the like button is clicked or a comment is added.
const PostDetails = ({ post: initialPost, userId, token }) => {
  const [post, setPost] = useState(initialPost);
  const [comment, setComment] = useState({});

  async function handleLike() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}/posts/${
          post._id
        }/like`,
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
      `${
        import.meta.env.VITE_APP_API_URL
      }/api/users/${userId}/posts/${postId}/comments`,
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
              <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
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
              width="20"
              height="20">
              <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
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
              fill="none"
              width="23.5"
              height="23.5">
              <path
                d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"
              />
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
