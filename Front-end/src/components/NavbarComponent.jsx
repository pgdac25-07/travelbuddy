import { Link, useNavigate } from "react-router-dom";

function NavbarComponent() {
  const navigate = useNavigate();

  // Very simple check → is user logged in?
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoLink}>
        <h3 style={styles.logo}>Travel Buddy</h3>
      </Link>

      <div style={styles.links}>
        {isLoggedIn ? (
          <>
            <span style={styles.welcome}>Welcome, {username}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
          <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#230527",
  },
  logoLink: {
    textDecoration: "none",
  },
  logo: {
    color: "#fff",
    margin: 0,
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
  },
  welcome: {
    color: "#e0d4ff",
    fontSize: "16px",
  },
  logoutButton: {
    background: "transparent",
    border: "1px solid #ff7777",
    color: "#ff7777",
    padding: "6px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default NavbarComponent;