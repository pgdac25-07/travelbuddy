import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CustomerDashboard() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample package data with images - matching database package names
  const samplePackages = [
    {
      packageId: 1,
      packageName: "Rajasthan Royal Tour",
      locations: "Udaipur-Jaipur-Jaisalmer",
      cost: 25000,
      duration: "5 days 4 nights",
      description: "Experience the grandeur of Rajasthan with visits to Udaipur, Jaipur, and Jaisalmer",
      image: "https://images.pexels.com/photos/4676485/pexels-photo-4676485.jpeg"
    },

    {
      packageId: 2,
      packageName: "Manali Adventure Package",
      locations: "Manali-Kullu-Solang Valley",
      cost: 18000,
      duration: "4 days 3 nights",
      description: "Adventure-filled trip to Manali, Kullu, and Solang Valley",
      image: "https://images.unsplash.com/photo-1519671482749-07f787f4e376?w=800&h=600&fit=crop&q=80"
    },
    {
      packageId: 3,
      packageName: "Goa Beach Getaway",
      locations: "North Goa-South Goa",
      cost: 15000,
      duration: "3 days 2 nights",
      description: "Perfect beach vacation in Goa with water sports and vibrant nightlife",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop&q=80"
    },
    {
      packageId: 4,
      packageName: "Kerala Backwater Cruise",
      locations: "Kochi-Munnar-Alleppey",
      cost: 22000,
      duration: "6 days 5 nights",
      description: "Peaceful journey through Kerala backwaters with houseboat stay",
      image: "https://images.unsplash.com/photo-1580596665273-07b5e6393c3f?w=800&h=600&fit=crop&q=80"
    },
    {
      packageId: 5,
      packageName: "Golden Triangle Heritage",
      locations: "Delhi-Agra-Fatehpur Sikri",
      cost: 12000,
      duration: "3 days 2 nights",
      description: "Explore the iconic Golden Triangle covering Delhi, Agra, and Fatehpur Sikri",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop&q=80"
    },
    {
      packageId: 6,
      packageName: "Shimla Hill Station Retreat",
      locations: "Shimla-Kufri-Chail",
      cost: 14000,
      duration: "4 days 3 nights",
      description: "Escape to the hills of Shimla, Kufri, and Chail with stunning mountain views",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&h=600&fit=crop&q=80"
    },
    {
      packageId: 7,
      packageName: "Mumbai City Explorer",
      locations: "Mumbai-Pune-Lonavala",
      cost: 16000,
      duration: "4 days 3 nights",
      description: "Discover the city of dreams - Mumbai with visits to Pune and Lonavala",
      image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&h=600&fit=crop&q=80"
    },
    {
      packageId: 8,
      packageName: "Darjeeling Tea Garden Tour",
      locations: "Darjeeling-Kalimpong-Gangtok",
      cost: 20000,
      duration: "5 days 4 nights",
      description: "Experience the charm of Darjeeling, Kalimpong, and Gangtok with tea gardens",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    // Fetch packages from API
    fetch("http://localhost:8080/packages/all")
      .then((res) => res.json())
      .then((data) => {
        // If API returns packages, merge with sample data (add images and locations)
        if (data && data.length > 0) {
          // Create a map of package names to sample data for easy lookup
          const packageMap = {};
          samplePackages.forEach(pkg => {
            packageMap[pkg.packageName] = pkg;
          });

          // Show all packages from database, use imageUrl from database if available
          const packagesWithImages = data
            .filter((pkg) => pkg && pkg.packageId && pkg.packageName) // Filter out invalid packages
            .map((pkg) => {
              const samplePkg = packageMap[pkg.packageName];
              
              // Generate image URL - use database imageUrl if available, otherwise generate based on package
              let imageToUse;
              if (pkg.imageUrl) {
                imageToUse = pkg.imageUrl;
              } else if (samplePkg && samplePkg.image) {
                imageToUse = samplePkg.image;
              } else {
                // Generate unique image based on package name and ID using picsum.photos
                const packageNameForImage = (pkg.packageName || "travel").toLowerCase().replace(/\s+/g, "-");
                imageToUse = `https://picsum.photos/seed/${packageNameForImage}-${pkg.packageId}/400/200`;
              }
              
              if (samplePkg) {
                return {
                  ...pkg,
                  locations: samplePkg.locations,
                  image: imageToUse,
                  duration: pkg.duration || samplePkg.duration
                };
              } else {
                // If package not in sample, use default values
                return {
                  ...pkg,
                  locations: "Multiple locations",
                  image: imageToUse,
                  duration: pkg.duration || "N/A"
                };
              }
            });

          setPackages(packagesWithImages);
        } else {
          // If no packages from API, use sample data
          setPackages(samplePackages);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        // On error, use sample data
        setPackages(samplePackages);
        setLoading(false);
      });
  }, []);

  const handlePackageClick = (pkg) => {
    navigate(`/customer/package/${pkg.packageId}`, { state: { package: pkg } });
  };

  const handleBookNow = (e, pkg) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/customer/book-package/${pkg.packageId}`, { state: { package: pkg } });
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
        <h1 className="display-4 fw-bold text-primary">Welcome to Travel Buddy</h1>
        <p className="lead text-muted">Discover amazing travel packages</p>
      </div>

      <div className="row g-4">
        {packages.map((pkg) => (
          <div key={pkg.packageId} className="col-md-6 col-lg-3">
            <div
              className="card h-100 shadow-sm border-0"
              style={{ cursor: "pointer", transition: "transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
              onClick={() => handlePackageClick(pkg)}
            >
              <img
                src={pkg.image}
                className="card-img-top"
                alt={pkg.packageName || "Travel package"}
                style={{ height: "200px", objectFit: "cover", backgroundColor: "#f0f0f0" }}
                onError={(e) => {
                  // Fallback to picsum.photos if original image fails
                  const packageNameForImage = (pkg.packageName || "travel").toLowerCase().replace(/\s+/g, "-");
                  e.target.src = `https://picsum.photos/seed/${packageNameForImage}-${pkg.packageId}/400/200`;
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-primary">{pkg.packageName || "Travel Package"}</h5>
                <p className="card-text text-muted small mb-2">
                  📍 {pkg.locations || "Multiple locations"}
                </p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-info text-dark">
                    📅 {pkg.duration}
                  </span>
                  <h6 className="text-success mb-0 fw-bold">
                    ₹{pkg.cost?.toLocaleString("en-IN") || pkg.cost}
                  </h6>
                </div>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={(e) => handleBookNow(e, pkg)}
                >
                  ✓ Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDashboard;
