import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.message === "invalid login") {
        alert("Invalid username or password");
        return;
      }

      // ✅ Save session
      const role = data.role?.toUpperCase();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", form.username);
      localStorage.setItem("role", role);

      // ✅ Role based routing
      const routes = {
        ADMIN: "/admin",
        COMPANY: "/company",
        CUSTOMER: "/customer",
      };

      navigate(routes[role] || "/");

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background:
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470') center/cover no-repeat",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white p-5 rounded shadow"
        style={{ width: "350px" }}
      >
        <h3 className="text-center fw-bold mb-4">Travel Buddy Login</h3>

        <input
          name="username"
          placeholder="Username"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-4"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
