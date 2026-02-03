import { Link, useNavigate } from "react-router-dom";

function NavbarComponent() {
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#230527" }}>
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          Travel Buddy
        </Link>

        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <>
              <span className="text-light me-3">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
              <Link className="nav-link text-white" to="/login">
                Login
              </Link>
              <Link className="nav-link text-white" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
