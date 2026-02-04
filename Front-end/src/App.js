// App.js
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

//Authentication Module
import NavbarComponent from "./components/NavbarComponent";
import Home from "./components/HomePage";
import Login from "./components/LoginComponent";
import Register from "./components/RegisterComponent";
import FooterComponent from "./components/FooterComponent"; // ← add this if you have a footer

//Company Module
import AddPackage from "./components/AddPackage";
import CompanyPackages from "./components/CompanyPackages";
import EditPackage from "./components/EditPackage";
import AddTrips from "./components/AddTrips";
import CompanyBookings from "./components/CompanyBookings";

//Customer Module
import CustomerPackages from "./components/CustomerPackages";
import CustomerTrips from "./components/CustomerTrips";
import CustomerDashboard from "./components/CustomerDashboard";
import PackageDetail from "./components/PackageDetail";
import BookPackage from "./components/BookPackage";
import CustomerFeedback from "./components/CustomerFeedback";
import CompanyFeedback from "./components/CompanyFeedback";

//Admin Module
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar always at top */}
        <NavbarComponent />

        {/* Main content grows to fill space */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/company/add-package" element={<AddPackage />} />
            <Route path="/company/packages" element={<CompanyPackages />} />
            <Route path="/company/edit-package/:id" element={<EditPackage />} />
            <Route path="/company/add-trip" element={<AddTrips />} />
            <Route path="/company/bookings" element={<CompanyBookings />} />
            <Route path="/customer/packages" element={<CustomerPackages />} />
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/package/:packageId" element={<PackageDetail />} />
            <Route path="/customer/book-package/:packageId" element={<BookPackage />} />
            <Route path="/customer/feedback" element={<CustomerFeedback />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route
              path="/company"
              element={
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <h1 style={{ marginBottom: "30px" }}>Travel Company Dashboard</h1>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "400px", margin: "0 auto" }}>
                    <Link
                      to="/company/add-package"
                      style={{
                        padding: "15px 30px",
                        background: "#09547c",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold"
                      }}
                    >
                      Add Package
                    </Link>

                    <Link
                      to="/company/packages"
                      style={{
                        padding: "15px 30px",
                        background: "#28a745",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold"
                      }}
                    >
                      View All Packages
                    </Link>

                    <Link
                      to="/company/add-trip"
                      style={{
                        padding: "15px 30px",
                        background: "#17a2b8",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold"
                      }}
                    >
                      Add Trip
                    </Link>

                    <Link
                      to="/company/bookings"
                      style={{
                        padding: "15px 30px",
                        background: "#ffc107",
                        color: "#000",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold"
                      }}
                    >
                      View Bookings
                    </Link>

                    <Link
                      to="/company/feedback"
                      style={{
                        padding: "15px 30px",
                        background: "#6c757d",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "18px",
                        fontWeight: "bold"
                      }}
                    >
                      View Feedback
                    </Link>
                  </div>
                </div>
              }
            />

            <Route path="/company/feedback" element={<CompanyFeedback />} />

            {/* 404 page */}
            <Route
              path="*"
              element={
                <div
                  className="container py-5 text-center"
                  style={{ fontSize: "1.3rem" }}
                >
                  <h2>Page not found (404)</h2>
                  <p className="mt-3">
                    <a href="/" className="btn btn-primary">
                      Go back to home
                    </a>
                  </p>
                </div>
              }
            />
            <Route
              path="/customer/trips/:packageId"
              element={<CustomerTrips />}
            />
          </Routes>
        </main>

        {/* Footer always at bottom */}
        {FooterComponent && <FooterComponent />}
      </div>
    </BrowserRouter>
  );
}

export default App;
