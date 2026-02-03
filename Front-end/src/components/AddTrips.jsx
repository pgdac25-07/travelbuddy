import { useState, useEffect } from "react";

function AddTrip() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [packageId, setPackageId] = useState("");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Fetch packages for dropdown - get packages for logged-in company
    // For now, get all packages. You may want to filter by company_id from session
    fetch("http://localhost:8082/packages/all", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate dates
    if (new Date(startDate) < new Date(today)) {
      alert("Start date cannot be in the past");
      setLoading(false);
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8082/trips/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startDate,
          endDate,
          packageId: parseInt(packageId),
        }),
      }).catch((fetchError) => {
        console.error("Network error:", fetchError);
        throw new Error(`Network error: ${fetchError.message}. Please ensure the backend server is running on port 8082.`);
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        console.error("Server error:", res.status, errorText);
        throw new Error(`Failed to add trip (${res.status}): ${errorText || "Unknown error"}`);
      }

      const result = await res.json();
      console.log("Trip added successfully:", result);
      alert("Trip added successfully!");
      setStartDate("");
      setEndDate("");
      setPackageId("");
    } catch (err) {
      console.error("Error adding trip:", err);
      alert(`Error adding trip: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Trip</h2>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={today}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        />

        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate || today}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        />

        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Package</label>
        <select
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        >
          <option value="">Select Package</option>
          {packages.map((pkg) => (
            <option key={pkg.packageId} value={pkg.packageId}>
              {pkg.packageName} - ₹{pkg.cost}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#666" : "#09547c", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Adding..." : "Add Trip"}
        </button>
      </form>
    </div>
  );
}

export default AddTrip;
