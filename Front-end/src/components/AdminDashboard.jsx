import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">

      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="d-grid gap-3 col-4 mx-auto">

        {/* Travellers Button */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/travellers")}
        >
          View Travellers
        </button>

        {/* Companies Button */}
        <button
          className="btn btn-warning"
          onClick={() => navigate("/admin/companies")}
        >
          Company Requests
        </button>

        {/* Logout */}
        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;
