const PostDetails = ({ post }) => {
  return (
    <div className="post-details">
      <h2>Post Details</h2>
      <p> Body: {post.body}</p>
      <p> Likes: {post.likes}</p>
      <p> Comments: {post.comments}</p>
      <p> Author: {post.author}</p>
      <p> Posted on: {post.createdAt}</p>
    </div>
  );
};

export default PostDetails;
