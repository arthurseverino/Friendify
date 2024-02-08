import { Link, useNavigate } from 'react-router-dom';

// first page the user sees, should be beautiful :)
const Index = ({ setToken, setUserId, setProfilePicture }) => {
  const navigate = useNavigate();

  //this makes a post resquest to api/users/login which gives the user a token
  const handleGuestLogin = async () => {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Visitor',
        password: 'visitor',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Save the token and user data in your application state
      setToken(data.token);
      setUserId(data.user._id);
      if (data.user.profilePicture) {
        setProfilePicture(data.user.profilePicture);
      } else {
        setProfilePicture(import.meta.env.VITE_DEFAULT_PROFILE_PICTURE);
      }
      navigate(`/api/users/${data.user._id}/posts`);
    } else {
      // Handle error
      console.error('Failed to log in as guest');
    }
  };

  return (
    <div>
      <h2>Odinbook </h2>
      <h3>Connect with friends and the world around you</h3>
      <Link to="/api/users/signup">Create New Account </Link>
      or
      <Link to="/api/users/login"> Login</Link>
      or
      <button onClick={handleGuestLogin}>Continue as Guest</button>
    </div>
  );
};

export default Index;
