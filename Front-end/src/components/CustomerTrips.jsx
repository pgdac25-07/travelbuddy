import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import goa from "../assets/packages/goa.png";
import manali from "../assets/packages/manali.png";
import rajasthan from "../assets/packages/Rajasthan.png";
import europe from "../assets/packages/Europe.png";
import def from "../assets/packages/default.png";

function CustomerTrips() {
  const { packageId } = useParams();

  const [trips, setTrips] = useState([]);
  const [pkg, setPkg] = useState(null);

  const images = { goa, manali, rajasthan, europe };

  const getImage = (name = "") =>
    images[
      Object.keys(images).find(key =>
        name.toLowerCase().includes(key)
      )
    ] || def;

  useEffect(() => {
    fetch(`http://localhost:8082/trips/by-package/${packageId}`)
      .then(res => res.json())
      .then(setTrips);

    fetch(`http://localhost:8082/packages/${packageId}`)
      .then(res => res.json())
      .then(setPkg);
  }, [packageId]);

  return (
    <div className="container py-5">

      <h2 className="fw-bold mb-4">Available Trips</h2>

      {trips.map(trip => (
        <div key={trip.tripId} className="card shadow-sm mb-4">

          <div className="row g-0 align-items-center">

            {/* IMAGE */}
            <div className="col-md-5 text-center p-3">
              <img
                src={getImage(pkg?.packageName)}
                alt="trip"
                className="img-fluid rounded"
                style={{ height: "300px", objectFit: "cover" }}
              />
            </div>

            {/* DETAILS */}
            <div className="col-md-7">
              <div className="card-body">

                <h4 className="fw-bold">{pkg?.packageName}</h4>

                <p className="text-muted">
                  {pkg?.description || "No description available"}
                </p>

                <p><strong>Start Date:</strong> {trip.startDate}</p>
                <p><strong>End Date:</strong> {trip.endDate}</p>

                <Link
                  to={`/customer/packages/book/${trip.tripId}`}
                  className="btn btn-success btn-lg mt-3"
                >
                  🧳 Book Now
                </Link>

              </div>
            </div>

          </div>

        </div>
      ))}

    </div>
  );
}

export default CustomerTrips;
