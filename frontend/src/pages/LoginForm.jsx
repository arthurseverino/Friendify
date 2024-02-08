import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginForm = ({ setToken, setUserId, setProfilePicture }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
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
          setProfilePicture(import.meta.env.VITE_DEFAULT_PROFILE_PICTURE);
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
    <div className="login">
      <h1>Sign in to your account </h1>
      <h3>
        or
        <Link to="/api/users/signup" className="signupLoginLink">
          Sign up for a new account
        </Link>
      </h3>
      <form onSubmit={handleLogin} className="loginForm">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="loginInput"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="loginInput"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="loginButton">
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
    </div>
  );
};

export default LoginForm;
