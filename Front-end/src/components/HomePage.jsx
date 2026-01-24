// components/Home.js   (or HomePage.js – whatever name you use)
import { Link } from 'react-router-dom';          // ← add this import
import NavbarComponent from './NavbarComponent'; // adjust path if needed

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "Guest";

  return (
    <>
      <NavbarComponent />

      <div style={styles.container}>
        <h1 style={styles.title}>
          {isLoggedIn ? `Welcome back, ${username}!` : "Welcome to Travel Buddy"}
        </h1>

        <p style={styles.subtitle}>
          {isLoggedIn 
            ? "Start planning your next adventure ✈️" 
            : "Login or register to explore amazing travel options"}
        </p>

        {!isLoggedIn && (
          <div style={styles.buttons}>
            <Link to="/login" style={styles.btn}>
              Login
            </Link>
            <Link to="/register" style={styles.btn}>
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "60px 20px",
    minHeight: "80vh",
    background: "linear-gradient(to bottom, #f0f4ff, #e6eaff)",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "20px",
    color: "#230527",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#444",
    maxWidth: "600px",
    margin: "0 auto 30px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  btn: {
    padding: "12px 28px",
    background: "#3a0b40",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "1.1rem",
    display: "inline-block",       // helps with consistent button look
  },
};

export default Home;