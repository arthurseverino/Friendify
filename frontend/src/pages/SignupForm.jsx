import { Link } from 'react-router-dom';
import { useState } from 'react';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName,
        }),
      });
      const data = await response.json();
      if (data.errors) {
        setError(data.errors);
      } else {
        setUsername('');
        setPassword('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setError(null);
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="signupPage">
      <h3>Sign up for free </h3>
      <h5>
        <Link to="/users/login" className="signupLoginLink">
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
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            className="signupInput"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button className="signupButton">Sign Up</button>
          <span className="signupError">{error}</span>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
