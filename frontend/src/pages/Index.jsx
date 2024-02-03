import { Link } from 'react-router-dom';

const Index = () => {
  // sign in as guest would go here !
  // first page the user sees, should be beautiful :)
  
/*
function Navigation({ token, userId }) {
  const navigate = useNavigate();

  // redirect to posts page if user is logged in
  useEffect(() => {
    if (token) {
      navigate(`/api/users/${userId}/posts`);
    }
  }, [token, navigate, userId]);

  return null;
}

       <Navigation token={token} userId={userId} />
*/

  return (
    <div>
      <h2>Odinbook </h2>
      <h3>Connect with friends and the world around you</h3>
      <Link to="/api/users/signup">Create New Account </Link>
      or
      <Link to="/api/users/login"> Login</Link>
    </div>
  );
};

export default Index;
