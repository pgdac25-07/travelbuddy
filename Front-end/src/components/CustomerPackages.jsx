import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerPackages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8082/packages/all")
      .then((res) => res.json())
      .then((data) => setPackages(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Packages</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.packageId}>
              <td>{pkg.packageName}</td>
              <td>{pkg.cost}</td>
              <td>{pkg.duration}</td>
              <td>
                <button
                  onClick={() => navigate(`/customer/trips/${pkg.packageId}`)}
                >
                  View Trips
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerPackages;
