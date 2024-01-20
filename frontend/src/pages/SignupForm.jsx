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
    const response = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, firstName, lastName }),
    });
    const data = await response.json();
    if (data.errors) {
      setError(data.errors);
    }
  };

  return (
    <div className="signup">
      <div className="signup__wrapper">
        <div className="signup__left">
          <h3 className="signup__logo">Facebook Clone</h3>
          Connect with friends and the world around you on Facebook Clone.
        </div>
        <div className="signup__right">
          <form onSubmit={handleSubmit} className="signup__form">
            <input
              type="text"
              placeholder="Username"
              className="signup__input"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="signup__input"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="signup__input"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="First Name"
              className="signup__input"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="signup__input"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <button className="signup__button">Sign Up</button>
            <span className="signup__error">{error}</span>
            <Link to="/login" className="signup__loginLink">
              Already have an account?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
