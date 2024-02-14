import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LoginForm = ({
  setToken,
  setUserId,
  setProfilePicture,
  token,
  userId,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(`/api/users/${userId}/posts`);
    }
  }, [token, userId, navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/users/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // The response was successful
        setUsername('');
        setPassword('');
        setError(null);
        setToken(data.token);
        setUserId(data.user._id);
        if (data.user.profilePicture) {
          setProfilePicture(data.user.profilePicture);
        } else {
          setProfilePicture(
            `${import.meta.env.VITE_APP_API_URL}/public/profilePic.jpg`
          );
        }
        navigate(`/api/users/${data.user._id}/posts`);
      } else {
        setError(
          data.errors
            ? data.errors.map((error) => error.msg).join(', ')
            : ' Server error '
        );
      }
    } catch (err) {
      const data = await err.response.json();
      console.error('Server error message: ', data);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sign in to your account</h2>
      <p className="login-signup-link">
        Or <Link to="/api/users/signup">Sign up for a new account </Link>
      </p>
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="login-input"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="login-input"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Sign In
        </button>
        {error && (
          <ul className="error">
            {error.split(', ').map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
      </form>
      <Link to="/"> Back to Home </Link>
    </div>
  );
};

export default LoginForm;
