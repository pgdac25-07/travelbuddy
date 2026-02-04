import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddPackage() {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [destinationsError, setDestinationsError] = useState("");

  useEffect(() => {
    // Fetch destinations for dropdown
    setDestinationsLoading(true);
    fetch("http://localhost:8080/destinations/all", {
     
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
      // If no image URL provided, generate a dynamic image based on package name
      let finalImageUrl = imageUrl;
      if (!finalImageUrl || finalImageUrl.trim() === "") {
        // Generate unique image URL using picsum.photos with package name as seed
        const packageNameForImage = (packageName || "travel").toLowerCase().replace(/\s+/g, "-");
        // We'll use a temporary ID, but the actual ID will be set after package is created
        // For now, use package name as seed
        finalImageUrl = `https://picsum.photos/seed/${packageNameForImage}/400/200`;
      }

      const response = await fetch("http://localhost:8080/packages/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      
        body: JSON.stringify({
          packageName,
          cost,
          duration,
          description,
          destinationId,
          imageUrl: finalImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add package");
      }

      const addedPackage = await response.json();
      alert("Package added successfully!");

      // Ask if user wants to add a trip for this package
      const addTrip = window.confirm("Package added successfully! Would you like to add a trip for this package?");
      
      if (addTrip) {
        // Navigate to add trip page with package ID
        navigate(`/company/add-trip?packageId=${addedPackage.packageId}`);
      } else {
        // clear form
        setPackageName("");
        setCost("");
        setDuration("");
        setDescription("");
        setDestinationId("");
        setImageUrl("");
      }

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
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseFloat(value) >= 0) {
              setCost(value);
            }
          }}
          min="0"
          step="0.01"
          required
        />
        {cost && parseFloat(cost) < 0 && (
          <span style={{ color: "red", fontSize: "12px" }}>
            Cost cannot be negative
          </span>
        )}

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

        <input
          type="url"
          placeholder="Image URL (optional - auto-generated if left empty)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {!imageUrl && (
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            💡 If left empty, an image will be automatically generated based on package name
          </div>
        )}

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
