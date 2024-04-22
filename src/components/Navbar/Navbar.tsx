import { Navbar as AppNavbar, Button, Nav } from 'react-bootstrap';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppNavbar sticky="top" expand="lg" className="navbar-container justify-content-between">
      <AppNavbar.Brand className="ms-4">
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
      </AppNavbar.Brand>
      <AppNavbar.Brand className="me-4">
        {user ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
        )}
      </AppNavbar.Brand>
    </AppNavbar>
  );
};

export default Navbar;
