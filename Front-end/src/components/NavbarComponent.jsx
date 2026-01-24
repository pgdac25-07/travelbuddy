import { Link } from "react-router-dom";

function NavbarComponent() {
  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>Travel Buddy</h3>

      
<div>
  <Link to="/login" style={styles.link}>Login</Link>
  <Link to="/register" style={styles.link}>Register</Link>
</div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#230527",
  },
  logo: {
    color: "#fff",
  },
  link: {
    color: "#fff",
    marginLeft: "20px",
    textDecoration: "none",
    fontSize: "16px",
  },
};

export default NavbarComponent;
