import { useState } from "react";

function AddTrip() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [packageId, setPackageId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8082/trips/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        packageId,
      }),
    });

    if (res.ok) {
      alert("Trip added successfully");
      setStartDate("");
      setEndDate("");
      setPackageId("");
    } else {
      alert("Failed to add trip");
    }
  };

  return (
    <div>
      <h2>Add Trip</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Package ID"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          required
        />

        <button type="submit">Add Trip</button>
      </form>
    </div>
  );
}

export default AddTrip;
