import { useState } from "react";
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
  const [result, setResult] = useState(null); // { type: "success"|"error", message: string }

  const loadBookingsForCustomer = async () => {
    if (!userId || role !== "CUSTOMER") {
      setBookings([]);
      return;
    }

    try {
      const res = await fetch(
        `${BOOKINGS_BASE_URL}/admin/travellers/all-with-details`,
        { credentials: "include" }
      );
      if (!res.ok) {
        // Fallback: if admin endpoint not accessible, just skip loading
        console.warn("Failed to load bookings for feedback:", res.status);
        setBookings([]);
        return;
      }
      const data = await res.json();
      // Filter bookings belonging to this customer/user if structure allows
      const allBookings = Array.isArray(data) ? data : [];
      const myBookings = allBookings.filter((b) => {
        // Try different possible fields that might relate to user/customer
        return (
          b.customerId === userId ||
          b.userId === userId ||
          b.user_id === userId ||
          b.customer_id === userId
        );
      });
      setBookings(myBookings);
    } catch (err) {
      console.warn("Error loading bookings for feedback:", err);
      setBookings([]);
    }
  };

  // Load bookings once when component renders
  if (bookings.length === 0 && role === "CUSTOMER" && userId) {
    // simple guard to avoid multiple calls in strict mode
    loadBookingsForCustomer();
  }

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
                disabled={loading || !Array.isArray(bookings) || bookings.length === 0}
                required
              >
                <option value="">Choose your booking</option>
                {Array.isArray(bookings) &&
                  bookings.map((b) => (
                    <option key={b.bookingId} value={b.bookingId}>
                      #{b.bookingId} - {b.packageName || b.tripName || "Trip"} (
                      {b.startDate || b.start_date} to {b.endDate || b.end_date})
                    </option>
                  ))}
              </select>
              {!bookings || bookings.length === 0 ? (
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

