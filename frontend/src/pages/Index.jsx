import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <h2>Facebook Clone </h2>
      <h3>Connect with friends and the world around you</h3>
      <h4>Ready for a state of the art social media app? </h4>
      <Link to="/users/signup">Create New Account </Link>
      or 
      <Link to="/users/login"> Login</Link>
    </div>
  );
};

export default Index;
