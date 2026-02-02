import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingForm() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const customerId = parseInt(localStorage.getItem("customerId") || 1);

  const [includeSelf, setIncludeSelf] = useState(false);
  const [loading, setLoading] = useState(false);

  const [travellers, setTravellers] = useState([
    { fname: "", lname: "", bdate: "", gender: "" }
  ]);

  // 🔹 update traveller field
  const update = (i, key, val) =>
    setTravellers(t =>
      t.map((x, idx) => (idx === i ? { ...x, [key]: val } : x))
    );

  // 🔹 add / remove
  const add = () =>
    setTravellers([...travellers, { fname: "", lname: "", bdate: "", gender: "" }]);

  const remove = (i) =>
    setTravellers(travellers.filter((_, idx) => idx !== i));

  // 🔹 submit
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:8082/bookings/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        tripId: +tripId,
        includeSelf,
        travellers
      })
    });

    setLoading(false);

    if (res.ok) {
      alert("Booking Successful 🎉");
      navigate("/customer/packages");
    } else {
      alert("Booking Failed ❌");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4">

        <h4 className="fw-bold mb-4 text-center">Book Trip #{tripId}</h4>

        <form onSubmit={submit}>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={() => setIncludeSelf(!includeSelf)}
            />
            <label className="form-check-label">Include myself</label>
          </div>

          {travellers.map((t, i) => (
            <div key={i} className="row g-2 mb-3">

              <input className="col form-control" placeholder="First"
                value={t.fname} onChange={e => update(i, "fname", e.target.value)} required />

              <input className="col form-control" placeholder="Last"
                value={t.lname} onChange={e => update(i, "lname", e.target.value)} />

              <input type="date" className="col form-control"
                value={t.bdate} onChange={e => update(i, "bdate", e.target.value)} />

              <select className="col form-select"
                value={t.gender} onChange={e => update(i, "gender", e.target.value)}>
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              {travellers.length > 1 && (
                <button type="button" className="btn btn-danger col-1"
                  onClick={() => remove(i)}>✕</button>
              )}

            </div>
          ))}

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-outline-primary" onClick={add}>
              + Add Traveller
            </button>

            <button className="btn btn-success" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
