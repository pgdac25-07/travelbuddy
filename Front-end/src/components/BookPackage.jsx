import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function BookPackage() {
  const { packageId: urlPackageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState(
    urlPackageId || "",
  );
  const [packages, setPackages] = useState([]);
  const [packageData, setPackageData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form state
  const [includeSelf, setIncludeSelf] = useState(true);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [travellers, setTravellers] = useState([
    { fname: "", lname: "", bdate: "", gender: "" },
  ]);

  // Extract number of days from duration string
  const extractDays = (duration) => {
    if (!duration) return null;
    const match = duration.match(/(\d+)\s*days?/i);
    return match ? parseInt(match[1]) : null;
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Calculate max date based on package duration
  const getMaxDate = (startDate, packageDays) => {
    if (!startDate || !packageDays) return null;
    const start = new Date(startDate);
    start.setDate(start.getDate() + packageDays - 1);
    return start.toISOString().split("T")[0];
  };

  useEffect(() => {
    // Fetch all packages for selection
    fetch("http://localhost:8080/packages/all")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        // If packageId from URL or state, set it
        if (urlPackageId) {
          const pkg = data.find((p) => p.packageId === parseInt(urlPackageId));
          if (pkg) {
            setSelectedPackageId(urlPackageId);
            setPackageData(pkg);
          }
        } else if (location.state?.package) {
          setPackageData(location.state.package);
          setSelectedPackageId(location.state.package.packageId.toString());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        setLoading(false);
      });
  }, [urlPackageId, location.state]);

  // Fetch trips when package is selected
  useEffect(() => {
    if (!selectedPackageId) {
      setTrips([]);
      setPackageData(null);
      return;
    }

    // Fetch package details
    fetch(`http://localhost:8080/packages/${selectedPackageId}`)
      .then((res) => res.json())
      .then((data) => {
        setPackageData(data);
      })
      .catch((err) => console.error("Error fetching package:", err));

    // Fetch available trips for this package
    fetch(`http://localhost:8080/trips/by-package/${selectedPackageId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Raw trips data from API:", data);
        console.log("Package ID:", selectedPackageId);

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

        const futureTrips = data.filter((trip) => {
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
          console.log(
            `Trip ${trip.tripId}: ${startDateStr} -> ${startDate.toISOString()}, isFuture: ${isFuture}`,
          );
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
        alert(
          `Error loading trips: ${err.message}. Please check the console for details.`,
        );
        setTrips([]);
        setLoading(false);
      });
  }, [selectedPackageId]);

  // Handle package selection
  const handlePackageChange = (e) => {
    const newPackageId = e.target.value;
    setSelectedPackageId(newPackageId);
    setSelectedTrip(null);
    setStartDate("");
    setEndDate("");
    setTrips([]);

    if (newPackageId) {
      setLoading(true);
      // Fetch package details
      fetch(`http://localhost:8080/packages/${newPackageId}`)
        .then((res) => res.json())
        .then((data) => {
          setPackageData(data);
        })
        .catch((err) => console.error("Error fetching package:", err));

      // Fetch trips
      fetch(`http://localhost:8080/trips/by-package/${newPackageId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (!data || !Array.isArray(data)) {
            setTrips([]);
            setLoading(false);
            return;
          }

          // Filter trips to only show future dates
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const futureTrips = data.filter((trip) => {
            const startDateStr = trip.startDate || trip.start_date;
            if (!startDateStr) return false;

            const startDate = new Date(startDateStr);
            if (isNaN(startDate.getTime())) return false;

            startDate.setHours(0, 0, 0, 0);
            return startDate >= today;
          });

          setTrips(futureTrips);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching trips:", err);
          setTrips([]);
          setLoading(false);
        });
    } else {
      setPackageData(null);
      setLoading(false);
    }
  };

  // Handle start date change - validate against package duration
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (newStartDate && packageData) {
      const packageDays = extractDays(packageData.duration);
      if (packageDays) {
        const maxDate = getMaxDate(newStartDate, packageDays);
        if (maxDate) {
          setEndDate(maxDate);
        }
      }
    } else {
      setEndDate("");
    }
  };

  const addTraveller = () => {
    setTravellers([
      ...travellers,
      { fname: "", lname: "", bdate: "", gender: "" },
    ]);
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
    if (bookingLoading) return;

    /* if (!selectedPackageId) {
      alert("Please select a package");
      return;
    }*/

    // If using date selection instead of trip selection
    if (startDate && endDate) {
      // Validate dates
      if (new Date(startDate) < new Date(today)) {
        alert("Start date cannot be in the past");
        return;
      }

      if (packageData) {
        const packageDays = extractDays(packageData.duration);
        if (packageDays) {
          const tripDays =
            Math.ceil(
              (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
            ) + 1;
          if (tripDays !== packageDays) {
            alert(
              `Trip duration must be exactly ${packageDays} days to match the package duration`,
            );
            return;
          }
        }
      }
    } else if (!selectedTrip) {
      alert("Please select a trip date or enter start and end dates");
      return;
    }

    // Validate travellers
    const validTravellers = travellers.filter(
      (t) => t.fname && t.lname && t.bdate && t.gender,
    );
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

      // If using date selection, find or create trip
      let tripIdToUse = selectedTrip;
      if (startDate && endDate && !selectedTrip) {
        // Find matching trip or use dates directly (backend may need to handle this)
        const matchingTrip = trips.find((trip) => {
          const tripStart = trip.startDate || trip.start_date;
          return tripStart === startDate;
        });
        if (matchingTrip) {
          tripIdToUse = matchingTrip.tripId || matchingTrip.trip_id;
        } else {
          alert(
            "No matching trip found for selected dates. Please select from available trips.",
          );
          return;
        }
      }

      const bookingData = {
        customerId: userId, // This is actually user_id, backend will convert to customer_id
        tripId: tripIdToUse,
        includeSelf: includeSelf,
        travellers: validTravellers,
        paymentStatus: paymentPaid ? "PAID" : "PENDING",
      };

      console.log("Booking data:", bookingData);
      console.log("Sending request to: http://localhost:8080/bookings/book");

      const response = await fetch("http://localhost:8080/bookings/book", {
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
          stack: fetchError.stack,
        });
        throw new Error(
          `Network error: ${fetchError.message}. Please ensure the backend server is running on port 8082 and check browser console for CORS errors.`,
        );
      });

      /*
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
      navigate("/customer");*/
      //const data = await response.json(); // ✅ only once
      const raw = await response.text(); // read once as text
      let data;

      try {
        data = JSON.parse(raw); // try JSON
      } catch {
        data = { message: raw }; // fallback for plain text
      }

      if (!response.ok) {
        alert(data.message || "Booking failed");
        throw new Error(data.message || "Booking failed");
      }

      alert(data.message || "Package booked successfully!");
      navigate("/customer");

      if (!response.ok) {
        alert(data.message || "Booking failed");
        throw new Error(data.message || "Booking failed");
      }

      console.log("Booking response:", data);

      alert(data.message || "Package booked successfully!");
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
              <h2 className="card-title text-primary fw-bold mb-4">
                Book Package
              </h2>

              {packageData && (
                <div className="mb-4">
                  <h5>{packageData.packageName}</h5>
                  <p className="text-muted">
                    📍 {packageData.locations || "Multiple locations"}
                  </p>
                  <p className="text-muted">📅 {packageData.duration}</p>
                  <h6 className="text-success">
                    ₹
                    {packageData.cost?.toLocaleString("en-IN") ||
                      packageData.cost}
                  </h6>
                </div>
              )}

              <hr />

              <form onSubmit={handleSubmit}>
                {/* Select Package */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Select Package</label>
                  <select
                    className="form-select"
                    value={selectedPackageId}
                    onChange={handlePackageChange}
                    required
                  >
                    <option value="">Select a package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.packageId} value={pkg.packageId}>
                        {pkg.packageName} - ₹{pkg.cost} ({pkg.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {packageData && (
                  <>
                    <div className="mb-4 p-3 bg-light rounded">
                      <h6>Selected Package: {packageData.packageName}</h6>
                      <p className="mb-1">
                        <strong>Duration:</strong> {packageData.duration}
                      </p>
                      <p className="mb-0">
                        <strong>Price:</strong> ₹{packageData.cost}
                      </p>
                    </div>

                    {/* Select Trip from Available Trips */}
                    {trips.length > 0 && (
                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Select Available Trip Date
                        </label>
                        <select
                          className="form-select"
                          value={selectedTrip || ""}
                          onChange={(e) => {
                            setSelectedTrip(parseInt(e.target.value));
                            const trip = trips.find(
                              (t) =>
                                (t.tripId || t.trip_id) ===
                                parseInt(e.target.value),
                            );
                            if (trip) {
                              setStartDate(
                                trip.startDate || trip.start_date || "",
                              );
                              setEndDate(trip.endDate || trip.end_date || "");
                            }
                          }}
                        >
                          <option value="">Select a trip</option>
                          {trips.map((trip) => {
                            const startDateStr =
                              trip.startDate || trip.start_date || "N/A";
                            const endDateStr =
                              trip.endDate || trip.end_date || "N/A";
                            return (
                              <option
                                key={trip.tripId || trip.trip_id}
                                value={trip.tripId || trip.trip_id}
                              >
                                {startDateStr} to {endDateStr}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {/* Or Enter Dates Manually */}
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        Or Enter Trip Dates
                      </label>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={handleStartDateChange}
                            min={today}
                            required={!selectedTrip}
                            disabled={selectedTrip !== null}
                          />
                          <small className="text-muted">
                            Only future dates allowed
                          </small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || today}
                            max={
                              startDate
                                ? getMaxDate(
                                    startDate,
                                    extractDays(packageData.duration),
                                  )
                                : null
                            }
                            required={!selectedTrip}
                            disabled={selectedTrip !== null || !startDate}
                          />
                          {packageData && extractDays(packageData.duration) && (
                            <small className="text-muted">
                              Must be exactly{" "}
                              {extractDays(packageData.duration)} days from
                              start date
                            </small>
                          )}
                        </div>
                      </div>
                      {startDate &&
                        endDate &&
                        packageData &&
                        extractDays(packageData.duration) &&
                        (() => {
                          const tripDays =
                            Math.ceil(
                              (new Date(endDate) - new Date(startDate)) /
                                (1000 * 60 * 60 * 24),
                            ) + 1;
                          const packageDays = extractDays(packageData.duration);
                          if (tripDays === packageDays) {
                            return (
                              <div className="mt-2 text-success">
                                <small>
                                  ✓ Duration matches package ({packageDays}{" "}
                                  days)
                                </small>
                              </div>
                            );
                          } else {
                            return (
                              <div className="mt-2 text-danger">
                                <small>
                                  ⚠ Duration must be {packageDays} days
                                  (currently {tripDays} days)
                                </small>
                              </div>
                            );
                          }
                        })()}
                    </div>

                    {trips.length === 0 && !startDate && (
                      <div className="alert alert-info">
                        <p className="mb-0">
                          No trips available for this package. Please enter
                          dates manually.
                        </p>
                      </div>
                    )}
                  </>
                )}

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
                    If checked, the booking will be marked as PAID instead of
                    PENDING
                  </small>
                </div>

                {/* Travellers */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw-bold mb-0">
                      Additional Travellers
                    </label>
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
                              onChange={(e) =>
                                updateTraveller(index, "fname", e.target.value)
                              }
                              required={!includeSelf || index === 0}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={traveller.lname}
                              onChange={(e) =>
                                updateTraveller(index, "lname", e.target.value)
                              }
                              required={!includeSelf || index === 0}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Date of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              value={traveller.bdate}
                              onChange={(e) =>
                                updateTraveller(index, "bdate", e.target.value)
                              }
                              required={!includeSelf || index === 0}
                              max={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Gender</label>
                            <select
                              className="form-select"
                              value={traveller.gender}
                              onChange={(e) =>
                                updateTraveller(index, "gender", e.target.value)
                              }
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
                    disabled={
                      bookingLoading ||
                      !selectedPackageId ||
                      (!selectedTrip && (!startDate || !endDate))
                    }
                  >
                    {bookingLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Booking...
                      </>
                    ) : (
                      <>✓ Confirm Booking</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div
            className="card shadow-sm border-0 sticky-top"
            style={{ top: "20px" }}
          >
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
                  ₹
                  {packageData.cost?.toLocaleString("en-IN") ||
                    packageData.cost}
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
                  ₹
                  {(
                    (packageData.cost || 0) *
                    (includeSelf ? travellers.length + 1 : travellers.length)
                  ).toLocaleString("en-IN")}
                </h4>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Payment Status</h6>
                <span
                  className={`badge ${paymentPaid ? "bg-success" : "bg-warning"}`}
                >
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
