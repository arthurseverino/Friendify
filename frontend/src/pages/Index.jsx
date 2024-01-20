import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <h1>Welcome to Facebook Clone</h1>
      <Link to="/users/signup">Create New Account </Link>
      or 
      <Link to="/users/login"> Login</Link>
    </div>
  );
};

export default Index;
