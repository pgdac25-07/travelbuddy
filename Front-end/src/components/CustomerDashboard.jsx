import { Link } from "react-router-dom";

function CustomerDashboard() {
  return (
    <div>
      <h2>Customer Dashboard</h2>

      <Link to="/customer/search-packages">🔍 Search Tour Packages</Link>
    </div>
  );
}

export default CustomerDashboard;
