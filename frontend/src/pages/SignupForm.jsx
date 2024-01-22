import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
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
          email,
          firstName,
        }),
      });

      if (response.ok) {
        // The response was successful
        setUsername('');
        setPassword('');
        setEmail('');
        setFirstName('');
        setError(null);
        navigate('/api/users/login');
      } else {
        // The response was not successful
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="signupPage">
      <h1>Sign up for free </h1>
      <h5>
        <Link to="/api/users/login" className="signupLoginLink">
          Already have an account?
        </Link>
      </h5>
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="signupInput"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            className="signupInput"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <button className="signupButton">Sign Up</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
