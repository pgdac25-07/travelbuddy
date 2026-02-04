import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CompanyPackages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/packages/all")
      .then((res) => res.json())
      .then((data) => setPackages(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?",
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `http://localhost:8080/packages/delete/${id}`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      alert("Package deleted");

      // UI refresh (remove deleted package)
      setPackages(packages.filter((pkg) => pkg.packageId !== id));
    } else {
      alert("Failed to delete package");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Packages</h2>

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
                  onClick={() =>
                    navigate(`/company/edit-package/${pkg.packageId}`)
                  }
                >
                  Edit
                </button>

                <button
                  style={{ marginLeft: "10px", color: "red" }}
                  onClick={() => handleDelete(pkg.packageId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyPackages;
