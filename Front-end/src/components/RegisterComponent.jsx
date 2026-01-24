import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = () => {
    let err = {};

    if (!formData.firstName.trim()) err.firstName = "Enter first name";
    if (!formData.lastName.trim()) err.lastName = "Enter last name";
    if (!formData.gender) err.gender = "Select gender";

    if (!formData.email.trim() || !emailRegex.test(formData.email))
      err.email = "Enter valid email";

    if (!formData.phone || !phoneRegex.test(formData.phone))
      err.phone = "Phone must be exactly 10 digits";

    if (!formData.password || !passwordRegex.test(formData.password))
      err.password =
        "Password must contain uppercase, lowercase, number, special char & ≥8 chars";

    if (!formData.role) err.role = "Select role";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/authister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Registered successfully:", data);
      alert("Registration Successful! ✅");

      setFormData({
        firstName: "", lastName: "", gender: "", email: "",
        phone: "", password: "", role: "",
      });

      // Optional: redirect after success
      // window.location.href = "/login";

    } catch (err) {
      console.error(err);
      setServerError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        {serverError && (
          <div style={{ color: "red", marginBottom: 12, textAlign: "center" }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.firstName}</span>

          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.lastName}</span>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <span style={styles.error}>{errors.gender}</span>

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.email}</span>

          <input
            name="phone"
            placeholder="Phone (10 digits)"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.phone}</span>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.password}</span>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Role</option>
            <option value="traveller">Traveller</option>
            <option value="travelCompany">Travel Company</option>
          </select>
          <span style={styles.error}>{errors.role}</span>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              background: loading ? "#666" : styles.button.background,
            }}
          >
            {loading ? "Registering..." : "Register"}
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
    background: "linear-gradient(135deg, #299794, #8f6cd6)",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#0f1f34",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#09547c",          // ← this exists now
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    marginTop: "10px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginBottom: "6px",
    display: "block",
  },
};

export default Register;