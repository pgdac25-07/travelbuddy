import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FEEDBACK_BASE_URL = "http://localhost:8080/api/feedback";
const BOOKINGS_BASE_URL = "http://localhost:8080";

function CustomerFeedback() {
  const role = localStorage.getItem("role");
  const userId = parseInt(localStorage.getItem("userId") || "", 10);

  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [result, setResult] = useState(null); // { type: "success"|"error", message: string }

  useEffect(() => {
    const loadBookingsForCustomer = async () => {
      if (!userId || role !== "CUSTOMER") {
        setBookings([]);
        setBookingsLoading(false);
        return;
      }

      setBookingsLoading(true);
      try {
        // Call the customer bookings endpoint
        const res = await fetch(
          `${BOOKINGS_BASE_URL}/bookings/customer/${userId}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          console.warn("Failed to load bookings for feedback:", res.status);
          setBookings([]);
          setBookingsLoading(false);
          return;
        }
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading bookings for feedback:", err);
        setBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    };

    loadBookingsForCustomer();
  }, [userId, role]); // Only run when userId or role changes

  const submitFeedback = async (e) => {
    e.preventDefault();
    setResult(null);

    if (role !== "CUSTOMER") {
      setResult({ type: "error", message: "Only travellers (CUSTOMER) can submit feedback." });
      return;
    }
    if (!userId) {
      setResult({ type: "error", message: "Missing userId. Please login again." });
      return;
    }

    const bookingIdNum = parseInt(selectedBookingId, 10);
    if (!bookingIdNum) {
      setResult({ type: "error", message: "Please select a booking." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerId: userId,
        bookingId: bookingIdNum,
        rating: parseInt(rating, 10),
        comment: comment?.trim() || null,
      };

      const res = await fetch(`${FEEDBACK_BASE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      setResult({ type: "success", message: data.message || "Feedback submitted successfully." });
      setSelectedBookingId("");
      setRating(5);
      setComment("");
    } catch (err) {
      setResult({ type: "error", message: err.message || "Failed to submit feedback." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="fw-bold mb-2">Submit Feedback</h2>
      <p className="text-muted mb-4">Traveller can submit feedback for a booking.</p>

      {result && (
        <div className={`alert ${result.type === "success" ? "alert-success" : "alert-danger"}`}>
          {result.message}
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={submitFeedback}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Booking</label>
              <select
                className="form-select"
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                disabled={loading || bookingsLoading || !Array.isArray(bookings) || bookings.length === 0}
                required
              >
                <option value="">
                  {bookingsLoading ? "Loading bookings..." : "Choose your booking"}
                </option>
                {Array.isArray(bookings) &&
                  bookings.map((b) => (
                    <option key={b.bookingId} value={b.bookingId}>
                      #{b.bookingId} - {b.packageName || "Trip"} ({b.tripDate || "N/A"})
                    </option>
                  ))}
              </select>
              {bookingsLoading ? (
                <div className="form-text text-muted">
                  Loading your bookings...
                </div>
              ) : !bookings || bookings.length === 0 ? (
                <div className="form-text text-danger">
                  No bookings found for your account. Please book a trip first.
                </div>
              ) : (
                <div className="form-text">
                  These bookings are automatically loaded for the logged-in traveller.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Rating (1 to 5)</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                disabled={loading}
              >
                <option value={1}>1 - Very Bad</option>
                <option value={2}>2 - Bad</option>
                <option value={3}>3 - Okay</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Comment</label>
              <textarea
                className="form-control"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                disabled={loading}
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerFeedback;

