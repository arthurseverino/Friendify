import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <h1>Index</h1>
      <Link to="/api/users/signup">Signup</Link>
      <Link to="/api/users/login">Login</Link>
    </div>
  );
};

export default Index;
