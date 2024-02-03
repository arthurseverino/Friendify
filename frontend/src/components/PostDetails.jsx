import { useState } from 'react';

const PostDetails = ({ post }) => {
  const [comment, setComment] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  async function handleLike() {
    const response = await fetch(`/api/users/${userId}/posts/${post._id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Update the post in the state to reflect the new like
    }
  }

  async function handleComment(e) {
    e.preventDefault();

    const response = await fetch(`/api/users/${userId}/posts/${post._id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include your token in the 'Authorization' header
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: comment }),
    });

    if (response.ok) {
      // Update the post in the state to reflect the new comment
      setComment('');
    }
  }

  return (
    <div className="post-details">
      <p>Posted by: {post.author.username}</p>
      <p> {post.body}</p>
      <p>{post.likes.length} likes</p>
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
            {comment.author.username}: {comment.text}
          </p>
        </div>
      ))}

    </div>
  );
};

export default PostDetails;
