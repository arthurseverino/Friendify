import { Link } from 'react-router-dom';
import { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      setError('An error occurred. Please try again.');
      return;
    }
  };

  return (
    <div className="login">
      <h3>Sign in to your account </h3>
      <h5>
        or
        <Link to="/users/signup" className="signupLoginLink">
          Sign up for a new account
        </Link>
      </h5>
      <label htmlFor="username">Username</label>
      <form onSubmit={handleSubmit} className="loginForm">
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
      </form>
    </div>
  );
};

export default LoginForm;
