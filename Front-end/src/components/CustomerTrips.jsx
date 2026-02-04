import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CustomerTrips() {
  const { packageId } = useParams();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/trips/by-package/${packageId}`)
      .then((res) => res.json())
      .then((data) => setTrips(data));
  }, [packageId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Trips</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr key={trip.tripId}>
              <td>{trip.startDate}</td>
              <td>{trip.endDate}</td>
              <td>
                <button>Book</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTrips;
