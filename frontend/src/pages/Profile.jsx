import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostDetails from '../components/PostDetails';

function Profile({ token, userId, setProfilePicture }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserAndPosts = async () => {
    setLoading(true);
    const userResponse = await fetch(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = await userResponse.json();
    setUser(userData);
    setPosts(userData.posts);

    /* setPosts((prevPosts) => {
      const newPosts = userData.posts.filter(
        (newPost) => !prevPosts.some((prevPost) => prevPost._id === newPost._id)
      );
      return [...prevPosts, ...newPosts];
    });*/

    setLoading(false);
  };

  useEffect(() => {
    fetchUserAndPosts();
  }, [id, token]);

  const handleProfilePictureSubmit = async (event) => {
    event.preventDefault();
    const file = event.target.profilePicture.files[0];

    // Check if a file was selected
    if (!file) {
      alert('No file selected!');
      return;
    }
    if (file.size > 2000000) {
      // 2MB
      alert('File is too big!');
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    setProfilePicture(data.profilePicture);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <img
        className="profilePicture"
        src={user.profilePicture}
        alt="Profile Picture"
      />

      {id === userId && (
        <button
          onClick={() => {
            if (user.username === 'Visitor') {
              alert(`You can't edit the visitor's profile picture`);
            } else {
              setIsModalOpen(true);
            }
          }}>
          Update Profile Picture
        </button>
      )}

      {isModalOpen && (
        <div className="modal">
          <button onClick={() => setIsModalOpen(false)}>Close</button>
          <form onSubmit={handleProfilePictureSubmit}>
            <input type="file" name="profilePicture" accept="image/*" />
            <button type="submit">Update</button>
          </form>
        </div>
      )}

      <h1> {user.username}&apos;s Profile </h1>

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
        <div>
          <p>
            {id === userId
              ? 'You have no posts, create one to see it here!'
              : 'No posts from this user yet!'}
          </p>
          <Link to={`/api/users/${userId}/posts/allPosts`}>
            <button>Go to All Posts</button>
          </Link>
          <Link to="/api/users">
            <button>Go to All Users</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
