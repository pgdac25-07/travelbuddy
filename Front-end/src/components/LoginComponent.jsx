import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [message, setMessage] = useState("");      // success or error message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();   // assuming backend returns JSON
      console.log(data);
      localStorage.setItem("role", data.role);

    if (data.role === "CUSTOMER") {
      navigate("/customer");
    } else if (data.role === "TRAVEL_COMPANY") {
      navigate("/company");
    } else {
     alert("Unknown role");
    }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username.trim());  // optional

      

    } catch (err) {
      
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Travel Buddy</h2>
        <p style={styles.subtitle}>Login to continue</p>

        

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#687eec",
  },
  card: {
    background: "#f7f7f7",
    padding: "30px",
    borderRadius: "10px",
    width: "320px",
    boxShadow: "0 0 10px rgba(112, 35, 104, 0.2)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 8px 0",
    color: "#3a0b40",
  },
  subtitle: {
    margin: "0 0 24px 0",
    color: "#555",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#3a0b40",
    color: "#d3edf0",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    marginBottom: "16px",
    fontSize: "14px",
  },
};

export default Login;