import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({
  userId,
  setToken,
  setUserId,
  token,
  profilePicture,
  setProfilePicture,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setProfilePicture(null);
    navigate('/');
  };

  if (!token) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={`/api/users/${userId}/posts`}>
          <h1>Friendify</h1>
        </Link>
        <Link to={`/api/users/${userId}/posts`} className="tooltip-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            fill="currentColor"
            width="24"
            height="24">
            <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
          </svg>
          <span className="tooltip">Home</span>
        </Link>
        <Link to="/api/users" className="tooltip-container">
          {' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            fill="currentColor"
            width="24"
            height="24">
            <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
          </svg>
          <span className="tooltip">Friends</span>
        </Link>
        <Link to={`/api/users/${userId}/posts/allPosts`} className="tooltip-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 580 512"
            fill="currentColor"
            width="24"
            height="24">
            <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H512c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm96 64a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm104 0c0-13.3 10.7-24 24-24H448c13.3 0 24 10.7 24 24s-10.7 24-24 24H224c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24H448c13.3 0 24 10.7 24 24s-10.7 24-24 24H224c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24H448c13.3 0 24 10.7 24 24s-10.7 24-24 24H224c-13.3 0-24-10.7-24-24zm-72-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM96 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
          </svg>
          <span className="tooltip">Posts</span>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to={`/api/users/${userId}`}>
          <img
            className="profilePicture"
            src={profilePicture}
            alt="Profile Picture"
          />
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};



export default Navbar;
