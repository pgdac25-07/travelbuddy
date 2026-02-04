import { Link } from "react-router-dom";

function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "Guest";

  const packages = [
    {
      name: "Golden Triangle",
      location: "Delhi - Agra - Jaipur",
      days: "5 Days / 4 Nights",
      price: "₹18,999",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=200&fit=crop",
      path: "/destination/golden-triangle",
    },
    {
      name: "Royal Rajasthan",
      location: "Udaipur - Jodhpur - Jaisalmer",
      days: "6 Days / 5 Nights",
      price: "₹24,500",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=200&fit=crop",
      path: "/destination/royal-rajasthan",
    },
    {
      name: "Kashmir Paradise",
      location: "Srinagar - Gulmarg - Pahalgam",
      days: "5 Days / 4 Nights",
      price: "₹21,000",
      image: "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?w=400&h=200&fit=crop",
      path: "/destination/kashmir-paradise",
    },
    {
      name: "Kerala Backwaters",
      location: "Munnar - Alleppey - Kochi",
      days: "4 Days / 3 Nights",
      price: "₹17,500",
      image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=400&h=200&fit=crop",
      path: "/destination/kerala-backwaters",
    },
    {
      name: "Goa Beach Escape",
      location: "North Goa - South Goa",
      days: "4 Days / 3 Nights",
      price: "₹14,999",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
      path: "/destination/goa-beach",
    },
    {
      name: "Himachal Adventure",
      location: "Shimla - Manali",
      days: "5 Days / 4 Nights",
      price: "₹19,800",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=200&fit=crop",
      path: "/destination/himachal-adventure",
    },
    {
      name: "Uttarakhand Hills",
      location: "Nainital - Mussoorie",
      days: "5 Days / 4 Nights",
      price: "₹16,750",
      image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=400&h=200&fit=crop",
      path: "/destination/uttarakhand-hills",
    },
    {
      name: "Andaman Island Tour",
      location: "Port Blair - Havelock",
      days: "5 Days / 4 Nights",
      price: "₹27,999",
      image: "https://images.unsplash.com/photo-1589307000251-2a0c1fda6a8c?w=400&h=200&fit=crop",
      path: "/destination/andaman-tour",
    },
  ];

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          {isLoggedIn ? `Welcome back, ${username}!` : "Welcome to Travel Buddy"}
        </h1>

        <p className="lead text-muted">
          {isLoggedIn
            ? "Choose your next destination 🌍"
            : "Login or register to view travel packages"}
        </p>

        {!isLoggedIn && (
          <div className="d-flex justify-content-center gap-4 mt-5">
            <Link to="/login" className="btn btn-primary px-5 py-3" style={{ fontSize: "18px", minWidth: "150px" }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-primary px-5 py-3" style={{ fontSize: "18px", minWidth: "150px" }}>
              Register
            </Link>
          </div>
        )}
      </div>

      {/* SHOW PACKAGES ONLY IF LOGGED IN */}
      {isLoggedIn && (
        <div className="row g-4">
          {packages.map((pkg, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <Link to={pkg.path} className="text-decoration-none">
                <div className="card h-100 shadow-sm">
                  <img
                    src={pkg.image}
                    className="card-img-top"
                    alt={pkg.name}
                    style={{ height: "200px", objectFit: "cover", backgroundColor: "#f0f0f0" }}
                    onError={(e) => {
                      // Fallback to picsum.photos if original image fails
                      const packageNameForImage = (pkg.name || "travel").toLowerCase().replace(/\s+/g, "-");
                      e.target.src = `https://picsum.photos/seed/${packageNameForImage}/400/200`;
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{pkg.name}</h5>
                    <p className="card-text small text-muted">{pkg.location}</p>
                    <p className="mb-1"><strong>{pkg.days}</strong></p>
                    <p className="text-success fw-bold">{pkg.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
