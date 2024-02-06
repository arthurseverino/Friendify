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
        navigate('/api/users/login');
      } else {
        setError(data.errors.map((error) => error.msg).join(', '));
        //setError(data.error);
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="signupPage">
      <h1>Sign up for free </h1>
      <h3>
        <Link to="/api/users/login" className="signupLoginLink">
          Already have an account?
        </Link>
      </h3>
      <div className="signupFormContainer">
        <form onSubmit={handleSubmit} className="signupForm">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="signupInput"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="signupInput"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="signupButton">Sign Up</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
