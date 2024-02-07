import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// You can use a state for the entire post and update it when the like button is clicked or a comment is added.
const PostDetails = ({ post: initialPost, userId, token }) => {
  const [post, setPost] = useState(initialPost);
  const [comment, setComment] = useState('');
  const [postDate, setPostDate] = useState('');

  useEffect(() => {
    const formattedDate = format(new Date(post.createdAt), 'MM/dd/yyyy');
    setPostDate(formattedDate);
  }, [post.createdAt]);

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

  async function handleComment(e) {
    try {
      e.preventDefault();

      const response = await fetch(
        `/api/users/${userId}/posts/${post._id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: comment }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        // Clear the comment input
        setComment('');
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="post-details">
      <p>
        <Link to={`/api/users/${post.author._id}`}>
          <img
            className="profilePicture"
            src={post.author.profilePicture}
            alt="Profile Picture"
          />
          {post.author.username}
        </Link>
      </p>
      <p>{postDate}</p>
      <p>{post.body}</p>
      <p>{post.likes ? post.likes.length : 0} likes</p>
      <button onClick={handleLike}>Like</button>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Comment</button>
      </form>
      {post.comments.map((comment) => (
        <div key={comment._id}>
          <p>
            <Link to={`/api/users/${comment.author._id}`}>
              <img
                className="profilePicture"
                src={comment.author.profilePicture}
                alt="Profile Picture"
              />
              {comment.author.username}
            </Link>
            : {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostDetails;
