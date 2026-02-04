import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function PackageDetail() {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If package data was passed via navigation state, use it
    if (location.state?.package) {
      setPackageData(location.state.package);
      setLoading(false);
    } else {
      // Otherwise, fetch from API
      fetch(`http://localhost:8080/packages/${packageId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Package not found");
          }
          return res.json();
        })
        .then((data) => {
          // Add sample image and locations if not present
          const samplePackages = {
            "Rajasthan Royal Tour": { locations: "Udaipur-Jaipur-Jaisalmer", image: "https://images.pexels.com/photos/4676485/pexels-photo-4676485.jpeg" },
            "Manali Adventure Package": { locations: "Manali-Kullu-Solang Valley", image: "https://images.unsplash.com/photo-1519671482749-07f787f4e376?w=800&h=600&fit=crop&q=80" },
            "Goa Beach Getaway": { locations: "North Goa-South Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&q=80" },
            "Kerala Backwater Cruise": { locations: "Kochi-Munnar-Alleppey", image: "https://images.unsplash.com/photo-1580596665273-07b5e6393c3f?w=800&h=600&fit=crop&q=80" },
            "Golden Triangle Heritage": { locations: "Delhi-Agra-Fatehpur Sikri", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop&q=80" },
            "Shimla Hill Station Retreat": { locations: "Shimla-Kufri-Chail", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop&q=80" },
            "Mumbai City Explorer": { locations: "Mumbai-Pune-Lonavala", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop&q=80" },
            "Darjeeling Tea Garden Tour": { locations: "Darjeeling-Kalimpong-Gangtok", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80" }
          };
          const sample = samplePackages[data.packageName] || samplePackages["Rajasthan Royal Tour"];
          setPackageData({
            ...data,
            locations: sample.locations,
            image: sample.image
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching package:", err);
          setLoading(false);
        });
    }
  }, [packageId, location.state]);

  const handleBookNow = () => {
    navigate(`/customer/book-package/${packageId}`, { state: { package: packageData } });
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
            <img
              src={packageData.image}
              className="card-img-top"
              alt={packageData.packageName}
              style={{ height: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/800x400/?travel,${packageData.packageName?.replace(/\s+/g, ',') || 'india'}`;
              }}
            />
            <div className="card-body">
              <h1 className="card-title text-primary fw-bold">{packageData.packageName}</h1>
              <p className="text-muted">
                📍 <strong>Locations:</strong> {packageData.locations}
              </p>
              <hr />
              <h5 className="fw-bold">Package Details</h5>
              <p className="card-text">{packageData.description || "Experience an amazing journey with this travel package."}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <h6 className="text-muted">Duration</h6>
                  <p className="fs-5">
                    📅 {packageData.duration}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">Package Cost</h6>
                  <p className="fs-4 text-success fw-bold">
                    ₹{packageData.cost?.toLocaleString("en-IN") || packageData.cost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h5 className="card-title fw-bold">Book This Package</h5>
              <hr />
              <div className="mb-3">
                <h6 className="text-muted">Price per person</h6>
                <h4 className="text-success fw-bold">
                  ₹{packageData.cost?.toLocaleString("en-IN") || packageData.cost}
                </h4>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Duration</h6>
                <p className="fs-6">{packageData.duration}</p>
              </div>
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleBookNow}
              >
                ✓ Book Now
              </button>
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate("/customer")}
              >
                ← Back to Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageDetail;
