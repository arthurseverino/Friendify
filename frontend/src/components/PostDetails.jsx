import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// You can use a state for the entire post and update it when the like button is clicked or a comment is added.
const PostDetails = ({ post: initialPost, userId, token }) => {
  const [post, setPost] = useState(initialPost);
  const [comment, setComment] = useState({});
  const [postDate, setPostDate] = useState('');
  const [isLoading, setIsLoading] = useState(!initialPost);

  useEffect(() => {
    if (!initialPost) {
      // Fetch the post here and update `post` and `isLoading` accordingly
    } else {
      const formattedDate = format(new Date(post.createdAt), 'MM/dd/yyyy');
      setPostDate(formattedDate);
    }
  }, [post.createdAt, initialPost]);

  async function handleLike() {
    try {
      const response = await fetch(
        `/api/users/${userId}/posts/${post._id}/like`,
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
      `/api/users/${userId}/posts/${postId}/comments`,
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

  if (isLoading) {
    return <div>Loading...</div>;
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
        <span>{postDate}</span>
      </div>
      <p className="post-body">{post.body}</p>
      {post.image && (
        <img
          className="postImage"
          src={`http://localhost:3000/${post.image}`}
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
            className={post.likes.includes(userId) ? 'liked' : ''}
            onClick={handleLike}>
            Like
          </button>
        </div>
        <div className="comments">
          <button type="submit" form={`comment-form-${post._id}`}>
            Comment
          </button>
        </div>
      </div>
      <hr />
      <form
        id={`comment-form-${post._id}`}
        className="comment-form"
        onSubmit={(e) => handleComment(e, post._id)}>
        <input
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
                <span className = 'comment-author'>{comment.author.username}</span>
              </Link>
              <p className = "comment-text">{comment.text}</p>
            </div>
          )
      )}
    </div>
  );
};

export default PostDetails;
