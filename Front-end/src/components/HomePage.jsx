// components/HomePage.js
import { Link } from "react-router-dom";

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "Guest";

  return (
    <div className="container-fluid bg-light d-flex align-items-center justify-content-center min-vh-100">

      <div className="text-center">

        <h1 className="display-4 fw-bold mb-3 text-dark">
          {isLoggedIn
            ? `Welcome back, ${username}!`
            : "Welcome to Travel Buddy"}
        </h1>

        <p className="lead text-secondary mb-4">
          {isLoggedIn
            ? "Start planning your next adventure ✈️"
            : "Login or register to explore amazing travel options"}
        </p>

        {!isLoggedIn && (
          <div className="d-flex justify-content-center gap-3">
            
            <Link to="/login" className="btn btn-primary px-4">
              Login
            </Link>

            <Link to="/register" className="btn btn-outline-primary px-4">
              Register
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
