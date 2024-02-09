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
    <div className="all-posts">
      <h1 className="allPostsText">All Posts </h1>
      <div className="posts-list">
        {isLoading ? (
          <div className="loader"></div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostDetails
              userId={userId}
              token={token}
              key={post._id}
              post={post}
            />
          ))
        ) : (
          'No posts yet! Create a post or follow someone to see it here.'
        )}
        {hasMorePosts && posts.length >= 10 && (
          <button
            className="load-more-posts"
            onClick={() => setPage(page + 1)}
            disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : 'Load More Posts'}
          </button>
        )}
      </div>
    </div>
  );
}

export default AllPosts;
