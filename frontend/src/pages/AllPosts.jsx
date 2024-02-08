import React, { useEffect, useState } from 'react';
import PostDetails from '../components/PostDetails';

function AllPosts({ userId, token }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); 
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const response = await fetch(
        `/api/users/${userId}/posts/allPosts?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        console.error('Failed to fetch posts');
        setIsLoading(false); 
        return;
      }
      const data = await response.json();
      setPosts((prevPosts) => {
        const newPosts = data.filter(
          (post) => !prevPosts.find((p) => p._id === post._id)
        );
        return [...prevPosts, ...newPosts];
      });

      if (data.length < 10) {
        setHasMorePosts(false);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [page]);

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
      {hasMorePosts && posts.length >= 10 && (
        <button onClick={() => setPage(page + 1)} disabled={isLoading}>
          Load More Posts
        </button> // Modify this line
      )}
    </div>
  );
}

export default AllPosts;
