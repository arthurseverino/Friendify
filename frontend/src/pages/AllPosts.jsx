import React, { useEffect, useState } from 'react';
import PostDetails from '../components/PostDetails';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/allPosts`, {
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
      {posts
        ? posts.map((post) => <PostDetails key={post._id} post={post} />)
        : 'No posts yet! Create a post or follow someone to see it here.'}
    </div>
  );
}

export default AllPosts;
