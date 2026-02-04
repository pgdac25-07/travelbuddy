import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CompanyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get companyId from logged-in user's userId
    // For now, we'll use userId as companyId (assuming companyId in packages = user_id)
    const userId = parseInt(localStorage.getItem("userId")) || 1;
    
    fetch(`http://localhost:8080/travelmgnt/company/${userId}/bookings`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Bookings data:", data);
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">All Bookings</h2>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="alert alert-info">
          No bookings found for your packages.
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Customer Name</th>
                    <th>Package</th>
                    <th>Date</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.customerName}</td>
                      <td>{booking.packageName}</td>
                      <td>{booking.tripDate}</td>
                      <td>
                        <span
                          className={`badge ${
                            booking.paymentStatus === "PAID"
                              ? "bg-success"
                              : booking.paymentStatus === "PENDING"
                              ? "bg-warning"
                              : "bg-secondary"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyBookings;
