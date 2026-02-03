import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminDashboard() {
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allTravellers, setAllTravellers] = useState([]);
  const [selectedTraveller, setSelectedTraveller] = useState(null);
  const [travellerTrips, setTravellerTrips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Fetching admin data...");
      
      const [pendingRes, companiesRes, customersRes, bookingsRes, travellersRes] = await Promise.all([
        fetch("http://localhost:8081/admin/pending-companies", { credentials: "include" }),
        fetch("http://localhost:8081/admin/all-companies", { credentials: "include" }),
        fetch("http://localhost:8081/admin/all-customers", { credentials: "include" }),
        fetch("http://localhost:8082/admin/bookings/all-with-details", { credentials: "include" }),
        fetch("http://localhost:8082/admin/travellers/all-with-details", { credentials: "include" })
      ]);

      console.log("API Responses:", {
        pending: pendingRes.status,
        companies: companiesRes.status,
        customers: customersRes.status,
        bookings: bookingsRes.status
      });

      const pending = await pendingRes.json();
      const companies = await companiesRes.json();
      const customers = await customersRes.json();
      let bookings = [];
      let travellers = [];
      
      try {
        bookings = await bookingsRes.json();
      } catch (e) {
        console.warn("Error fetching bookings:", e);
        bookings = [];
      }

      try {
        travellers = await travellersRes.json();
      } catch (e) {
        console.warn("Error fetching travellers:", e);
        travellers = [];
      }

      console.log("Data received:", {
        pending: pending.length,
        companies: companies.length,
        customers: customers.length,
        bookings: bookings.length,
        travellers: travellers.length
      });

      setPendingCompanies(pending);
      setAllCompanies(companies);
      setAllCustomers(customers);
      setAllBookings(bookings);
      setAllTravellers(travellers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Error loading data. Check console for details. Make sure both backend services are running.");
      setLoading(false);
    }
  };

  const handleApproveCompany = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/approve-company/${userId}`, {
        method: "PUT",
        credentials: "include"
      });
      if (response.ok) {
        alert("Company approved successfully!");
        fetchData();
      } else {
        alert("Failed to approve company");
      }
    } catch (err) {
      console.error("Error approving company:", err);
      alert("Error approving company");
    }
  };

  const handleRejectCompany = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/reject-company/${userId}`, {
        method: "PUT",
        credentials: "include"
      });
      if (response.ok) {
        alert("Company rejected successfully!");
        fetchData();
      } else {
        alert("Failed to reject company");
      }
    } catch (err) {
      console.error("Error rejecting company:", err);
      alert("Error rejecting company");
    }
  };

  const handleActivateCustomer = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/activate-customer/${userId}`, {
        method: "PUT",
        credentials: "include"
      });
      if (response.ok) {
        alert("Customer activated successfully!");
        fetchData();
      } else {
        alert("Failed to activate customer");
      }
    } catch (err) {
      console.error("Error activating customer:", err);
      alert("Error activating customer");
    }
  };

  const handleDeactivateCustomer = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/admin/deactivate-customer/${userId}`, {
        method: "PUT",
        credentials: "include"
      });
      if (response.ok) {
        alert("Customer deactivated successfully!");
        fetchData();
      } else {
        alert("Failed to deactivate customer");
      }
    } catch (err) {
      console.error("Error deactivating customer:", err);
      alert("Error deactivating customer");
    }
  };

  const handleUpdatePaymentStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8082/admin/bookings/update-payment-status/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ paymentStatus: newStatus })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert(result.message || "Payment status updated successfully!");
        fetchData();
      } else {
        alert(result.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      alert("Error updating payment status");
    }
  };

  const handleTravellerClick = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8082/admin/travellers/booking/${bookingId}/trips`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const tripDetails = await response.json();
        setTravellerTrips(tripDetails);
        setSelectedTraveller(bookingId);
      } else {
        alert("Failed to load trip details");
      }
    } catch (err) {
      console.error("Error fetching trip details:", err);
      alert("Error loading trip details");
    }
  };

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
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Admin Dashboard</h1>
        <p className="lead text-muted">Manage Travel Companies and Customers</p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Companies ({pendingCompanies.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "companies" ? "active" : ""}`}
            onClick={() => setActiveTab("companies")}
          >
            All Companies ({allCompanies.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            All Customers ({allCustomers.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings ({allBookings.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "travellers" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("travellers");
              setSelectedTraveller(null);
              setTravellerTrips(null);
            }}
          >
            Travellers ({allTravellers.length})
          </button>
        </li>
      </ul>

      {/* Pending Companies Tab */}
      {activeTab === "pending" && (
        <div className="tab-content">
          <h3 className="mb-4">Pending Travel Companies</h3>
          {pendingCompanies.length === 0 ? (
            <div className="alert alert-info">No pending companies</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCompanies.map((company) => (
                    <tr key={company.userId}>
                      <td>{company.userId}</td>
                      <td>{company.username}</td>
                      <td>{company.email}</td>
                      <td>
                        <span className="badge bg-warning">{company.status || "PENDING"}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApproveCompany(company.userId)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRejectCompany(company.userId)}
                        >
                          ✗ Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* All Companies Tab */}
      {activeTab === "companies" && (
        <div className="tab-content">
          <h3 className="mb-4">All Travel Companies</h3>
          {allCompanies.length === 0 ? (
            <div className="alert alert-info">No companies found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allCompanies.map((company) => (
                    <tr key={company.userId}>
                      <td>{company.userId}</td>
                      <td>{company.username}</td>
                      <td>{company.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            company.status === "ACTIVE"
                              ? "bg-success"
                              : company.status === "REJECTED"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {company.status || "PENDING"}
                        </span>
                      </td>
                      <td>
                        {company.status !== "ACTIVE" ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApproveCompany(company.userId)}
                          >
                            ✓ Activate
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRejectCompany(company.userId)}
                          >
                            ✗ Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* All Customers Tab */}
      {activeTab === "customers" && (
        <div className="tab-content">
          <h3 className="mb-4">All Customers</h3>
          {allCustomers.length === 0 ? (
            <div className="alert alert-info">No customers found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allCustomers.map((customer) => (
                    <tr key={customer.userId}>
                      <td>{customer.userId}</td>
                      <td>{customer.username}</td>
                      <td>{customer.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            customer.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {customer.status || "INACTIVE"}
                        </span>
                      </td>
                      <td>
                        {customer.status !== "ACTIVE" ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleActivateCustomer(customer.userId)}
                          >
                            ✓ Activate
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeactivateCustomer(customer.userId)}
                          >
                            ✗ Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="tab-content">
          <h3 className="mb-4">All Bookings</h3>
          {allBookings.length === 0 ? (
            <div className="alert alert-info">No bookings found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Name</th>
                    <th>Customer Email</th>
                    <th>Booking Date</th>
                    <th>Trip Dates</th>
                    <th>No. of Travellers</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.customerName || "N/A"}</td>
                      <td>{booking.customerEmail || "N/A"}</td>
                      <td>{booking.bookingDate || "N/A"}</td>
                      <td>
                        {booking.tripStartDate && booking.tripEndDate
                          ? `${booking.tripStartDate} to ${booking.tripEndDate}`
                          : "N/A"}
                      </td>
                      <td>{booking.noOfTravellers || 0}</td>
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
                          {booking.paymentStatus || "PENDING"}
                        </span>
                      </td>
                      <td>
                        {booking.paymentStatus === "PENDING" ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdatePaymentStatus(booking.bookingId, "PAID")}
                          >
                            Mark as Paid
                          </button>
                        ) : booking.paymentStatus === "PAID" ? (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleUpdatePaymentStatus(booking.bookingId, "PENDING")}
                          >
                            Mark as Pending
                          </button>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Travellers Tab */}
      {activeTab === "travellers" && (
        <div className="tab-content">
          <h3 className="mb-4">All Travellers</h3>
          {allTravellers.length === 0 ? (
            <div className="alert alert-info">No travellers found</div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Traveller ID</th>
                        <th>Name</th>
                        <th>Booking ID</th>
                        <th>Package</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTravellers.map((traveller) => (
                        <tr 
                          key={traveller.travellerId}
                          style={{ 
                            cursor: "pointer",
                            backgroundColor: selectedTraveller === traveller.bookingId ? "#e7f3ff" : ""
                          }}
                          onClick={() => handleTravellerClick(traveller.bookingId)}
                        >
                          <td>{traveller.travellerId}</td>
                          <td>
                            {traveller.fname || ""} {traveller.lname || ""}
                          </td>
                          <td>{traveller.bookingId || "N/A"}</td>
                          <td>{traveller.packageName || "N/A"}</td>
                          <td>
                            <span
                              className={`badge ${
                                traveller.paymentStatus === "PAID"
                                  ? "bg-success"
                                  : traveller.paymentStatus === "PENDING"
                                  ? "bg-warning"
                                  : "bg-secondary"
                              }`}
                            >
                              {traveller.paymentStatus || "PENDING"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-info btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTravellerClick(traveller.bookingId);
                              }}
                            >
                              View Trips
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="col-md-6">
                {travellerTrips && (
                  <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">Trip Details</h5>
                    </div>
                    <div className="card-body">
                      <h6 className="text-primary">Booking Information</h6>
                      <p><strong>Booking ID:</strong> {travellerTrips.bookingId}</p>
                      <p><strong>Booking Date:</strong> {travellerTrips.bookingDate || "N/A"}</p>
                      <p><strong>Payment Status:</strong> 
                        <span className={`badge ms-2 ${
                          travellerTrips.paymentStatus === "PAID" ? "bg-success" : "bg-warning"
                        }`}>
                          {travellerTrips.paymentStatus || "PENDING"}
                        </span>
                      </p>
                      <p><strong>Number of Travellers:</strong> {travellerTrips.noOfTravellers || 0}</p>
                      
                      <hr />
                      
                      <h6 className="text-primary">Customer Information</h6>
                      <p><strong>Name:</strong> {travellerTrips.customerName || "N/A"}</p>
                      <p><strong>Email:</strong> {travellerTrips.customerEmail || "N/A"}</p>
                      
                      <hr />
                      
                      <h6 className="text-primary">Trip Information</h6>
                      <p><strong>Package Name:</strong> {travellerTrips.packageName || "N/A"}</p>
                      <p><strong>Package Cost:</strong> ₹{travellerTrips.packageCost?.toLocaleString("en-IN") || "N/A"}</p>
                      <p><strong>Duration:</strong> {travellerTrips.packageDuration || "N/A"}</p>
                      <p><strong>Trip Dates:</strong> {
                        travellerTrips.tripStartDate && travellerTrips.tripEndDate
                          ? `${travellerTrips.tripStartDate} to ${travellerTrips.tripEndDate}`
                          : "N/A"
                      }</p>
                      
                      {travellerTrips.packageDescription && (
                        <p><strong>Description:</strong> {travellerTrips.packageDescription}</p>
                      )}
                      
                      <hr />
                      
                      <h6 className="text-primary">Travellers in this Booking</h6>
                      {travellerTrips.travellers && travellerTrips.travellers.length > 0 ? (
                        <ul className="list-group">
                          {travellerTrips.travellers.map((t, idx) => (
                            <li key={idx} className="list-group-item">
                              <strong>{t.fname || ""} {t.lname || ""}</strong>
                              {t.gender && <span className="ms-2">({t.gender})</span>}
                              {t.bdate && <span className="ms-2">- DOB: {t.bdate}</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No travellers found</p>
                      )}
                    </div>
                  </div>
                )}
                {!travellerTrips && (
                  <div className="alert alert-info">
                    Click on a traveller to view their trip details
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
