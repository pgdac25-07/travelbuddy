import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function AddTrips() {
  const [searchParams] = useSearchParams();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [packageId, setPackageId] = useState("");
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [durationError, setDurationError] = useState("");

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Check if packageId is in URL params (from AddPackage redirect)
    const urlPackageId = searchParams.get("packageId");
    if (urlPackageId) {
      setPackageId(urlPackageId);
    }

    // Fetch packages for dropdown - get packages for logged-in company
    // For now, get all packages. You may want to filter by company_id from session
    fetch("http://localhost:8080/travelmgnt/packages/all")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        // If packageId from URL, set the selected package
        if (urlPackageId) {
          const pkg = data.find(p => p.packageId === parseInt(urlPackageId));
          if (pkg) {
            setSelectedPackage(pkg);
          }
        }
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, [searchParams]);

  // Extract number of days from duration string (e.g., "5 days" -> 5)
  const extractDays = (duration) => {
    if (!duration) return null;
    const match = duration.match(/(\d+)\s*days?/i);
    return match ? parseInt(match[1]) : null;
  };

  // Calculate days between two dates
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle package selection
  const handlePackageChange = (e) => {
    const selectedId = e.target.value;
    setPackageId(selectedId);
    const pkg = packages.find(p => p.packageId === parseInt(selectedId));
    setSelectedPackage(pkg);
    setDurationError("");
    // Reset dates when package changes
    setStartDate("");
    setEndDate("");
  };

  // Handle date changes and validate duration
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setDurationError("");
    if (e.target.value && endDate && selectedPackage) {
      validateDuration(e.target.value, endDate, selectedPackage);
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setDurationError("");
    if (startDate && e.target.value && selectedPackage) {
      validateDuration(startDate, e.target.value, selectedPackage);
    }
  };

  const validateDuration = (start, end, pkg) => {
    const packageDays = extractDays(pkg.duration);
    if (packageDays === null) {
      setDurationError("Package duration format not recognized");
      return false;
    }

    const tripDays = calculateDays(start, end);
    if (tripDays !== packageDays) {
      setDurationError(`Trip duration must be exactly ${packageDays} days to match the package duration`);
      return false;
    }
    setDurationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDurationError("");

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

    // Validate duration matches package duration
    if (selectedPackage) {
      const packageDays = extractDays(selectedPackage.duration);
      if (packageDays !== null) {
        const tripDays = calculateDays(startDate, endDate);
        if (tripDays !== packageDays) {
          alert(`Trip duration must be exactly ${packageDays} days to match the package duration (${selectedPackage.duration})`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const res = await fetch("http://localhost:8080/travelmgnt/trips/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
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
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px" }}>Add Trip</h2>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Package</label>
        <select
          value={packageId}
          onChange={handlePackageChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" }}
        >
          <option value="">Select Package</option>
          {packages.map((pkg) => (
            <option key={pkg.packageId} value={pkg.packageId}>
              {pkg.packageName} - ₹{pkg.cost} ({pkg.duration})
            </option>
          ))}
        </select>

        {selectedPackage && (
          <div style={{ marginBottom: "15px", padding: "10px", background: "#e7f3ff", borderRadius: "5px" }}>
            <strong>Selected Package:</strong> {selectedPackage.packageName}<br />
            <strong>Duration:</strong> {selectedPackage.duration}<br />
            <small style={{ color: "#666" }}>Trip must be exactly {extractDays(selectedPackage.duration) || "N/A"} days</small>
          </div>
        )}

        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          min={today}
          required
          disabled={!packageId}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px", opacity: packageId ? 1 : 0.6 }}
        />

        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate || today}
          required
          disabled={!packageId || !startDate}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: durationError ? "1px solid red" : "1px solid #ccc", fontSize: "16px", opacity: (packageId && startDate) ? 1 : 0.6 }}
        />
        {durationError && (
          <div style={{ color: "red", fontSize: "14px", marginBottom: "15px", padding: "8px", background: "#ffe6e6", borderRadius: "5px" }}>
            {durationError}
          </div>
        )}
        {selectedPackage && startDate && endDate && !durationError && (
          <div style={{ color: "green", fontSize: "14px", marginBottom: "15px", padding: "8px", background: "#e6ffe6", borderRadius: "5px" }}>
            ✓ Trip duration matches package duration ({selectedPackage.duration})
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#666" : "#09547c", color: "#fff", border: "none", borderRadius: "6px", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Adding..." : "Add Trip"}
        </button>
      </form>
    </div>
  );
}

export default AddTrips;
