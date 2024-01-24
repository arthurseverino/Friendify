import { Link } from 'react-router-dom';

const Index = () => {
  // sign in as guest would go here !
  // first page the user sees, should be beautiful :) 
  return (
    <div>
      <h2>Facebook Clone </h2>
      <h3>Connect with friends and the world around you</h3>
      <h4>Ready for a state of the art social media app? </h4>
      <Link to="/api/users/signup">Create New Account </Link>
      or 
      <Link to="/api/users/login"> Login</Link>
    </div>
  );
};

export default Index;
