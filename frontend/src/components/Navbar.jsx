import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className = "Navbar">
      <div className="container">
        <Link to="/">
          <h1>Navbar</h1>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
