import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/packages/logo.png";

function NavbarComponent() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "User";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-5 py-3 shadow">

      {/* Logo */}
      <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4">
  <img src={logo} alt="logo" width="90" className="img-fluid rounded" />
  Travel Buddy
</Link>

      <div className="d-flex align-items-center gap-3">

        {isLoggedIn ? (
          <>
            <span className="text-light fs-5">
              Welcome, {username}
            </span>

            <button
              onClick={logout}
              className="btn btn-danger px-4"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="btn btn-outline-light px-4">
              Home
            </Link>

            <Link to="/login" className="btn btn-primary px-4">
              Login
            </Link>

            <Link to="/register" className="btn btn-success px-4">
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default NavbarComponent;
