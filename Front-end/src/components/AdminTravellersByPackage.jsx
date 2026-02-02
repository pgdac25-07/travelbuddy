import { useEffect, useState } from "react";

function AdminTravellersByPackage() {
  const [packages, setPackages] = useState([]);
  const [travellers, setTravellers] = useState([]);
  const [selected, setSelected] = useState("");

  // load packages on page load
  useEffect(() => {
    fetch("http://localhost:8082/admin/packages", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setPackages);
  }, []);

  // when package selected
  const loadTravellers = (id) => {
    setSelected(id);

    fetch(`http://localhost:8082/admin/travellers/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(setTravellers);
  };

  return (
    <div className="container mt-4">
      <h3>Travellers by Package</h3>

      {/* Dropdown */}
      <select
        className="form-select mb-3"
        onChange={(e) => loadTravellers(e.target.value)}
      >
        <option>Select Package</option>
        {packages.map(p => (
          <option key={p.packageId} value={p.packageId}>
            {p.packageName}
          </option>
        ))}
      </select>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {travellers.map(t => (
            <tr key={t.userId}>
              <td>{t.userId}</td>
              <td>{t.username}</td>
              <td>{t.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTravellersByPackage;
