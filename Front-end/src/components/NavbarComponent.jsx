import { Link, useNavigate } from "react-router-dom";

function NavbarComponent() {
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#230527" }}
    >
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          Travel Buddy
        </Link>

        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <>
              {role === "CUSTOMER" && (
                <Link
                  className="nav-link text-white me-2"
                  to="/customer/feedback"
                >
                  Feedback
                </Link>
              )}
              {role === "TRAVEL_COMPANY" && (
                <Link
                  className="nav-link text-white me-2"
                  to="/company/feedback"
                >
                  Feedback
                </Link>
              )}
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
              <Link className="nav-link text-white me-4" to="/">
                Home
              </Link>

              <Link className="nav-link text-white me-4" to="/login">
                Login
              </Link>

              <Link className="nav-link text-white me-4" to="/register">
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
