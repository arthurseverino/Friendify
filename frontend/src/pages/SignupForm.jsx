import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUsername('');
        setPassword('');
        setError(null);
        console.log('User created successfully: ', data.username);
        navigate('/api/users/login');
      } else {
        setError(
          data.errors
            ? data.errors.map((error) => error.msg).join(', ')
            : ' Server error '
        );
      }
    } catch (err) {
      console.error('try/catch error: ', err);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign up for free</h2>
      <p className="signup-login-link">
        Or <Link to="/api/users/login">Sign in to your existing account</Link>
      </p>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="signup-input"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
  
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="signup-input"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
  
        <button type="submit" className="signup-button">Sign Up</button>
        {error && (
          <ul className="error">
            {error.split(', ').map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
      </form>
      <Link to = "/"> Back to Home </Link>
    </div>
  );
};

export default SignupForm;
