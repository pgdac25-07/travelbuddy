import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8082";

function AdminTravellers() {

  const [list, setList] = useState([]);
  const navigate = useNavigate();   // ⭐ for back navigation

  useEffect(() => {
    fetch(`${API}/admin/travellers`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        console.log("DATA:", data);
        setList(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div className="container mt-4">

      {/* 🔥 Back Button */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admin")}
      >
        ← Back to Dashboard
      </button>

      <h3>All Travellers</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Birth Date</th>
            <th>Gender</th>
          </tr>
        </thead>

        <tbody>
          {list.map(t => (
            <tr key={t.travellerId}>
              <td>{t.travellerId}</td>
              <td>{t.fname}</td>
              <td>{t.lname}</td>
              <td>{t.bdate}</td>
              <td>{t.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTravellers;
