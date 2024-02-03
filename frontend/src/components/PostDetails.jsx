const PostDetails = ({ post }) => {
  return (
    <div className="post-details">
      <h2>Post Details</h2>
      <p> {post.body}</p>
      <p> Likes: {post.likes}</p>
      <p> Comments: {post.comments}</p>
      <p> Author: {post.author}</p>
      <button> Edit</button>
      <button> Delete</button>
    </div>
  );
};

export default PostDetails;
