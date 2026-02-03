import { useState, useEffect } from "react";

function AddPackage() {
  const [packageName, setPackageName] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [destinationsError, setDestinationsError] = useState("");

  useEffect(() => {
    // Fetch destinations for dropdown
    setDestinationsLoading(true);
    fetch("http://localhost:8082/destinations/all", {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Destinations fetched:", data);
        if (Array.isArray(data)) {
          setDestinations(data);
        } else {
          console.error("Destinations data is not an array:", data);
          setDestinationsError("Failed to load destinations");
        }
        setDestinationsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching destinations:", err);
        setDestinationsError("Failed to load destinations. Please check if the server is running.");
        setDestinationsLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8082/packages/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 session ke liye IMPORTANT
        body: JSON.stringify({
          packageName,
          cost,
          duration,
          description,
          destinationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add package");
      }

      alert("Package added successfully!");

      // clear form
      setPackageName("");
      setCost("");
      setDuration("");
      setDescription("");
      setDestinationId("");

    } catch (err) {
      console.error(err);
      alert("Error adding package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h2>Add Travel Package</h2>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px", padding: "10px", background: "#f0f0f0", borderRadius: "5px" }}>
          <strong>Debug Info:</strong><br />
          Destinations loaded: {destinations.length}<br />
          Loading: {destinationsLoading ? "Yes" : "No"}<br />
          Error: {destinationsError || "None"}
        </div>
      )}

      {destinations.length === 0 && !destinationsLoading && !destinationsError && (
        <div style={{ color: "orange", marginBottom: "10px", fontSize: "14px" }}>
          No destinations found. Please ensure destinations are added to the database.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Package Name"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />

        <input
          placeholder="Duration (e.g. 5 days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Destination {destinations.length > 0 && `(${destinations.length} available)`}
          </label>
          {destinationsError && (
            <div style={{ color: "red", fontSize: "12px", marginBottom: "5px" }}>
              {destinationsError}
            </div>
          )}
          <select
            value={destinationId}
            onChange={(e) => {
              console.log("Selected destination ID:", e.target.value);
              setDestinationId(e.target.value);
            }}
            required
            disabled={destinationsLoading}
            style={{ 
              width: "100%", 
              padding: "12px", 
              marginBottom: "5px", 
              borderRadius: "5px", 
              border: destinationsError ? "1px solid red" : "1px solid #ccc", 
              fontSize: "16px",
              backgroundColor: destinationsLoading ? "#f5f5f5" : "white",
              cursor: destinationsLoading ? "not-allowed" : "pointer",
              minHeight: "44px",
              zIndex: 1
            }}
          >
            <option value="">
              {destinationsLoading ? "Loading destinations..." : "Select Destination"}
            </option>
            {destinations.length > 0 ? (
              destinations.map((dest) => {
                const displayName = dest.dname || `Destination ${dest.destinationId}`;
                return (
                  <option key={dest.destinationId} value={dest.destinationId}>
                    {displayName}
                  </option>
                );
              })
            ) : (
              !destinationsLoading && <option value="" disabled>No destinations available</option>
            )}
          </select>
          {destinations.length > 0 && (
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Click the dropdown to see {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Package"}
        </button>
      </form>
    </div>
  );
}

export default AddPackage;
