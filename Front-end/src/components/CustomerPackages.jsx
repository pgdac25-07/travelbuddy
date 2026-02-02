import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ local images
import goa from "../assets/packages/goa.png";
import manali from "../assets/packages/manali.png";
import Rajasthan from "../assets/packages/Rajasthan.png";
import Europe from "../assets/packages/Europe.png";
 import def from "../assets/packages/default.png";

function CustomerPackages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  // ✅ image map (keys lowercase only)
  const images = {
    goa,
    manali,
    Rajasthan,
    Europe,
  };

  useEffect(() => {
    fetch("http://localhost:8082/packages/all")
      .then(res => res.json())
      .then(setPackages);
  }, []);

  // ✅ helper function (case-insensitive matching)
  const getImage = (name) => {
    const lower = name.toLowerCase();

    const match = Object.keys(images).find(key =>
      lower.includes(key)
    );

    return match ? images[match] : def;
  };

  return (
    <div className="container py-5">

      <h2 className="text-center fw-bold mb-4">Explore Packages ✈️</h2>

      <div className="row g-4">

        {packages.map(pkg => (
          <div key={pkg.packageId} className="col-md-4">

            <div className="card shadow h-100">

              {/* ✅ smart case-insensitive image */}
              <img
                src={getImage(pkg.packageName)}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt="travel"
              />

              <div className="card-body text-center">
                <h5 className="fw-bold">{pkg.packageName}</h5>
                <p>₹ {pkg.cost}</p>
                <p>{pkg.description}</p>
                <p className="text-muted">{pkg.duration} days</p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    navigate(`/customer/trips/${pkg.packageId}`)
                  }
                >
                  View Trips
                </button>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default CustomerPackages;
