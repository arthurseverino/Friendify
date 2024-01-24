import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LoginForm = ({ userId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // The response was successful
        setUsername('');
        setPassword('');
        setError(null);
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          navigate(`/api/users/${userId}/posts`);
        }, 0);
      } else {
        // The response was not successful
        const data = await response.json();
        setError('setError error:', data.error);
      }
    } catch (err) {
      setError('try/catch error:', err);
    }
  };

  return (
    <div className="login">
      <h1>Sign in to your account </h1>
      <h5>
        or
        <Link to="/api/users/signup" className="signupLoginLink">
          Sign up for a new account
        </Link>
      </h5>
      <label htmlFor="username">Ask for Email, not username</label>
      <form onSubmit={handleLogin} className="loginForm">
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
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
