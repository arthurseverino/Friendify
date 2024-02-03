import { useState, useEffect } from 'react';


// You can use a state for the entire post and update it when the like button is clicked or a comment is added. 
const PostDetails = ({ post: initialPost }) => {
  const [post, setPost] = useState(initialPost);
  const [comment, setComment] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

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
      <p>Author: {post.author?.username}</p>
      <p>{post.body}</p>
      <p>{post.likes ? post.likes.length : 0} likes</p>

      <div>
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
      </div>

      {post.comments.map((comment) => (
        <div key={comment._id}>
          <p>
            {comment.author.username}: {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostDetails;
