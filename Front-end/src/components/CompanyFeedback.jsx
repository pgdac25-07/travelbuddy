import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FEEDBACK_BASE_URL = "https://localhost:8080/api/feedback";

function CompanyFeedback() {
  const role = localStorage.getItem("role");

  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  const loadAllFeedback = async () => {
    setError("");
    setFeedbacks([]);

    if (role !== "TRAVEL_COMPANY" && role !== "ADMIN") {
      setError("Only TRAVEL_COMPANY or ADMIN can view all feedback here.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${FEEDBACK_BASE_URL}/all`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  //Auto-load when component opens
  if (!loading && feedbacks.length === 0) {
    loadAllFeedback();
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">All Traveller Feedback</h2>
          <p className="text-muted mb-0">Travel company can see all feedback given by travellers.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Results</h5>
          {feedbacks.length === 0 ? (
            <p className="text-muted mb-0">No feedback found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Feedback ID</th>
                    <th>Customer ID</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f.feedbackId ?? `${f.customerId}-${f.createdAt}`}>
                      <td>{f.feedbackId}</td>
                      <td>{f.customerId}</td>
                      <td>{f.rating}</td>
                      <td style={{ maxWidth: 420 }}>{f.comment}</td>
                      <td>{f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyFeedback;

