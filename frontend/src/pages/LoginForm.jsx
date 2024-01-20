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
      <div className="login__wrapper">
        <div className="login__left">
          <h3 className="login__logo">Facebook Clone</h3>
          Login to Facebook Clone
        </div>
        <div className="login__right">
          <form onSubmit={handleSubmit} className="login__form">
            <input
              type="text"
              placeholder="Username"
              className="login__input"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="login__input"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login__btn">
              Log In
            </button>
            or 
            <Link to="/users/signup" className="login__link">
              Create New Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
