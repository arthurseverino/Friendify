import { useState, useEffect } from 'react';

const PostDetails = ({ post }) => {
  const [newPost, setNewPost] = useState(post);
  const [comment, setComment] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');



  //do i need this useEffect? 
  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`/api/users/${userId}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const post = await response.json();
        setNewPost(post);
      }
    }

    fetchPost();
  }, [post._id, token]);





  async function handleLike() {
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
      // In this code, setPost is called with a new object that has all the properties of the post object and an updated likes array. The likes array is created by spreading the likes array from the post object and adding the userId to the end. This effectively increments the like counter by 1.
      setNewPost({
        ...post,
        likes: [...post.likes, userId],
      });
    }
  }

  async function handleComment(e) {
    e.preventDefault();

    const response = await fetch(
      `/api/users/${userId}/posts/${post._id}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include your token in the 'Authorization' header
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: comment }),
      }
    );

    if (response.ok) {
      const newComment = await response.json();
      // In this code, setNewPost is called with a new object that has all the properties of the post object and an updated comments array. The comments array is created by spreading the comments array from the post object and adding the newComment to the end.
      setNewPost({
        ...post,
        comments: [...post.comments, newComment],
      });
      setComment('');
    }
  }

  return (
    <div className="post-details">
      <p>Posted by: {post.author.username}</p>
      <p> {post.body}</p>
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
            {comment.author.username}: {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostDetails;
