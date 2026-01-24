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

  // ✅ REGEX RULES
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!formData.firstName) err.firstName = "Enter first name";
    if (!formData.lastName) err.lastName = "Enter last name";
    if (!formData.gender) err.gender = "Select gender";

    if (!emailRegex.test(formData.email))
      err.email = "Enter valid email (example@gmail.com)";

    if (!phoneRegex.test(formData.phone))
      err.phone = "Phone number must be 10 digits";

    if (!passwordRegex.test(formData.password))
      err.password =
        "Password must contain A, a, 1, special char & min 8 chars";

    if (!formData.role) err.role = "Select role";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Registered User:", formData);
      alert("Registration Successful ✅");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="First Name (e.g. Vaishnavi)"
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.firstName}</span>

          <input
            name="lastName"
            placeholder="Last Name (e.g. Kale)"
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.lastName}</span>

          <select
            name="gender"
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <span style={styles.error}>{errors.gender}</span>

          <input
            name="email"
            placeholder="Email (e.g. user@gmail.com)"
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.email}</span>

          <input
            name="phone"
            placeholder="Phone No (10 digits only)"
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.phone}</span>

          <input
            type="password"
            name="password"
            placeholder="Password (Strong password)"
            onChange={handleChange}
            style={styles.input}
          />
          <span style={styles.error}>{errors.password}</span>

          <select
            name="role"
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Role</option>
            <option value="traveller">Traveller</option>
            <option value="travelCompany">Travel Company</option>
          </select>
          <span style={styles.error}>{errors.role}</span>

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

//style
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
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#09547c",
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


