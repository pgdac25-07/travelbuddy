import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState({
    packageName: "",
    cost: "",
    duration: "",
    description: "",
    destinationId: ""
  });

  // 1️⃣ load existing package
  useEffect(() => {
    fetch(`http://localhost:8080/packages/${id}`)
      .then(res => res.json())
      .then(data => setPkg(data));
  }, [id]);

  // 2️⃣ submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8080/packages/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pkg),
    });

    alert("Package updated");
    navigate("/company/packages");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Package</h2>

      <input
        value={pkg.packageName}
        onChange={e => setPkg({ ...pkg, packageName: e.target.value })}
        placeholder="Package Name"
      />

      <input
        value={pkg.cost}
        onChange={e => setPkg({ ...pkg, cost: e.target.value })}
        placeholder="Cost"
      />

      <input
        value={pkg.duration}
        onChange={e => setPkg({ ...pkg, duration: e.target.value })}
        placeholder="Duration"
      />

      <textarea
        value={pkg.description}
        onChange={e => setPkg({ ...pkg, description: e.target.value })}
      />

      <input
        value={pkg.destinationId}
        onChange={e => setPkg({ ...pkg, destinationId: e.target.value })}
        placeholder="Destination ID"
      />

      <button type="submit">Update</button>
    </form>
  );
}

export default EditPackage;
