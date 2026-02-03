import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function BookPackage() {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form state
  const [includeSelf, setIncludeSelf] = useState(true);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [travellers, setTravellers] = useState([
    { fname: "", lname: "", bdate: "", gender: "" }
  ]);

  useEffect(() => {
    // Get package data
    if (location.state?.package) {
      setPackageData(location.state.package);
    } else {
      fetch(`http://localhost:8082/packages/${packageId}`)
        .then((res) => res.json())
        .then((data) => setPackageData(data))
        .catch((err) => console.error("Error fetching package:", err));
    }

    // Fetch available trips for this package
    fetch(`http://localhost:8082/trips/by-package/${packageId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Raw trips data from API:", data);
        console.log("Package ID:", packageId);
        
        // Handle case where data might be null or undefined
        if (!data || !Array.isArray(data)) {
          console.warn("No trips data or invalid format:", data);
          setTrips([]);
          setLoading(false);
          return;
        }

        // Filter trips to only show future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const futureTrips = data.filter(trip => {
          // Handle both camelCase and snake_case field names
          const startDateStr = trip.startDate || trip.start_date;
          if (!startDateStr) {
            console.warn("Trip missing startDate:", trip);
            return false;
          }
          
          const startDate = new Date(startDateStr);
          if (isNaN(startDate.getTime())) {
            console.warn("Invalid date format:", startDateStr);
            return false;
          }
          
          startDate.setHours(0, 0, 0, 0);
          const isFuture = startDate >= today;
          console.log(`Trip ${trip.tripId}: ${startDateStr} -> ${startDate.toISOString()}, isFuture: ${isFuture}`);
          return isFuture;
        });
        
        console.log("Filtered future trips:", futureTrips);
        setTrips(futureTrips);
        if (futureTrips.length > 0) {
          setSelectedTrip(futureTrips[0].tripId);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trips:", err);
        alert(`Error loading trips: ${err.message}. Please check the console for details.`);
        setTrips([]);
        setLoading(false);
      });
  }, [packageId, location.state]);

  const addTraveller = () => {
    setTravellers([...travellers, { fname: "", lname: "", bdate: "", gender: "" }]);
  };

  const removeTraveller = (index) => {
    if (travellers.length > 1) {
      setTravellers(travellers.filter((_, i) => i !== index));
    }
  };

  const updateTraveller = (index, field, value) => {
    const updated = [...travellers];
    updated[index][field] = value;
    setTravellers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTrip) {
      alert("Please select a trip date");
      return;
    }

    // Validate travellers
    const validTravellers = travellers.filter(t => t.fname && t.lname && t.bdate && t.gender);
    if (validTravellers.length === 0 && !includeSelf) {
      alert("Please add at least one traveller or include yourself");
      return;
    }

    setBookingLoading(true);

    try {
      // Get user_id from session - the backend will convert it to customer_id
      // For now, we'll use a default or get from localStorage if available
      let userId = parseInt(localStorage.getItem("userId")) || 1;
      
      // Try to get from session if available
      try {
        // Note: The backend expects user_id, and will convert it to customer_id internally
        // So we pass user_id as customerId in the request
      } catch (err) {
        console.log("Using default user_id");
      }

      const bookingData = {
        customerId: userId, // This is actually user_id, backend will convert to customer_id
        tripId: selectedTrip,
        includeSelf: includeSelf,
        travellers: validTravellers,
        paymentStatus: paymentPaid ? "PAID" : "PENDING"
      };

      console.log("Booking data:", bookingData);
      console.log("Sending request to: http://localhost:8082/bookings/book");

      const response = await fetch("http://localhost:8082/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      }).catch((fetchError) => {
        console.error("Network error details:", {
          message: fetchError.message,
          name: fetchError.name,
          stack: fetchError.stack
        });
        throw new Error(`Network error: ${fetchError.message}. Please ensure the backend server is running on port 8082 and check browser console for CORS errors.`);
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        let errorMessage = "Unknown error";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
          const errorText = await response.text().catch(() => "Unknown error");
          errorMessage = errorText;
        }
        console.error("Booking failed:", response.status, errorMessage);
        throw new Error(`Booking failed (${response.status}): ${errorMessage}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log("Booking response:", responseData);
      } catch {
        const responseText = await response.text();
        console.log("Booking response (text):", responseText);
        responseData = { message: responseText };
      }

      alert(responseData.message || "Package booked successfully!");
      navigate("/customer");
    } catch (err) {
      console.error("Error booking package:", err);
      alert(`Error booking package: ${err.message}`);
    } finally {
      setBookingLoading(false);
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

  if (!packageData) {
    return (
      <div className="container py-5 text-center">
        <h2>Package not found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/customer")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/customer")}
      >
        ← Back to Dashboard
      </button>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h2 className="card-title text-primary fw-bold mb-4">Book Package</h2>
              
              <div className="mb-4">
                <h5>{packageData.packageName}</h5>
                <p className="text-muted">
                  📍 {packageData.locations || "Multiple locations"}
                </p>
                <p className="text-muted">
                  📅 {packageData.duration}
                </p>
                <h6 className="text-success">
                  ₹{packageData.cost?.toLocaleString("en-IN") || packageData.cost}
                </h6>
              </div>

              <hr />

              <form onSubmit={handleSubmit}>
                {/* Select Trip */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Select Trip Date</label>
                  <select
                    className="form-select"
                    value={selectedTrip || ""}
                    onChange={(e) => setSelectedTrip(parseInt(e.target.value))}
                    required
                  >
                    <option value="">Select a trip</option>
                    {trips.map((trip) => {
                      const startDate = trip.startDate || trip.start_date || "N/A";
                      const endDate = trip.endDate || trip.end_date || "N/A";
                      return (
                        <option key={trip.tripId || trip.trip_id} value={trip.tripId || trip.trip_id}>
                          {startDate} to {endDate}
                        </option>
                      );
                    })}
                  </select>
                  {trips.length === 0 && (
                    <div className="mt-2">
                      <p className="text-danger small">No trips available for this package</p>
                      <p className="text-muted small">
                        Check the browser console (F12) for debugging information.
                      </p>
                    </div>
                  )}
                </div>

                {/* Include Self */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="includeSelf"
                      checked={includeSelf}
                      onChange={(e) => setIncludeSelf(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="includeSelf">
                      Include myself in the booking
                    </label>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="paymentPaid"
                      checked={paymentPaid}
                      onChange={(e) => setPaymentPaid(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="paymentPaid">
                      <strong>Payment Completed</strong> (Mark booking as PAID)
                    </label>
                  </div>
                  <small className="text-muted">
                    If checked, the booking will be marked as PAID instead of PENDING
                  </small>
                </div>

                {/* Travellers */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw-bold mb-0">Additional Travellers</label>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addTraveller}
                    >
                      + Add Traveller
                    </button>
                  </div>

                  {travellers.map((traveller, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Traveller {index + 1}</h6>
                          {travellers.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeTraveller(index)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveller.fname}
                              onChange={(e) => updateTraveller(index, "fname", e.target.value)}
                              required={!includeSelf || index === 0}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveller.lname}
                              onChange={(e) => updateTraveller(index, "lname", e.target.value)}
                              required={!includeSelf || index === 0}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Date of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              value={traveller.bdate}
                              onChange={(e) => updateTraveller(index, "bdate", e.target.value)}
                              required={!includeSelf || index === 0}
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Gender</label>
                            <select
                              className="form-select"
                              value={traveller.gender}
                              onChange={(e) => updateTraveller(index, "gender", e.target.value)}
                              required={!includeSelf || index === 0}
                            >
                              <option value="">Select</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={bookingLoading || trips.length === 0}
                  >
                    {bookingLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Booking...
                      </>
                    ) : (
                      <>
                        ✓ Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Booking Summary</h5>
              <hr />
              <div className="mb-3">
                <h6 className="text-muted">Package</h6>
                <p className="mb-0">{packageData.packageName}</p>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Price per person</h6>
                <h5 className="text-success fw-bold">
                  ₹{packageData.cost?.toLocaleString("en-IN") || packageData.cost}
                </h5>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Number of Travellers</h6>
                <p className="fs-5">
                  {includeSelf ? travellers.length + 1 : travellers.length}
                </p>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Total Amount</h6>
                <h4 className="text-primary fw-bold">
                  ₹{((packageData.cost || 0) * (includeSelf ? travellers.length + 1 : travellers.length)).toLocaleString("en-IN")}
                </h4>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Payment Status</h6>
                <span className={`badge ${paymentPaid ? "bg-success" : "bg-warning"}`}>
                  {paymentPaid ? "PAID" : "PENDING"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookPackage;
