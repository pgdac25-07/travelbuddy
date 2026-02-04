import { useState } from "react";

function AddPackage() {
  const [packageName, setPackageName] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Add Travel Package</h2>

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

        <input
          type="number"
          placeholder="Destination ID"
          value={destinationId}
          onChange={(e) => setDestinationId(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Package"}
        </button>
      </form>
    </div>
  );
}

export default AddPackage;
