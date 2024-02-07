import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostDetails from '../components/PostDetails';

function Profile({ token, userId }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const userResponse = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      setUser(userData);
      setProfilePicture(userData.profilePicture);

      const postsResponse = await fetch(`/api/users/${id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let postsData = await postsResponse.json();
      postsData = postsData.filter((post) => post.author._id === id);
      setPosts(postsData);

      setLoading(false);
    };

    fetchUserAndPosts();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <img
        className="profilePicture"
        src = {profilePicture} 
        alt = "Profile Picture" 
      />
      <h1> {user.username}&apos;s PROFILE </h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostDetails
            userId={userId}
            token={token}
            key={post._id}
            post={post}
          />
        ))
      ) : (
        <p>No posts yet!</p>
      )}
    </div>
  );
}

export default Profile;
