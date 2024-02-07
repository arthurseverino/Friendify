import React, { useEffect, useState } from 'react';
import PostDetails from '../components/PostDetails';

function AllPosts({ userId, token }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts/allPosts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch posts');
        return;
      }
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>All Posts </h1>
      {posts
        ? posts.map((post) => (
            <PostDetails
              userId={userId}
              token={token}
              key={post._id}
              post={post}
            />
          ))
        : 'No posts yet! Create a post or follow someone to see it here.'}
    </div>
  );
}

export default AllPosts;
