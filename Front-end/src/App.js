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

//Customer Module
import CustomerPackages from "./components/CustomerPackages";
import CustomerTrips from "./components/CustomerTrips";

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
            <Route path="/customer/packages" element={<CustomerPackages />} />
            <Route
              path="/customer"
              element={
                <div style={{ textAlign: "center" }}>
                  <h1>Customer Dashboard</h1>

                  <a href="/customer/packages">View Packages</a>
                </div>
              }
            />

            <Route
              path="/customer"
              element={
                <h1 style={{ textAlign: "center" }}>Customer Dashboard</h1>
              }
            />

            <Route
              path="/company"
              element={
                <div style={{ textAlign: "center" }}>
                  <h1>Travel Company Dashboard</h1>

                  <Link to="/company/add-trip">Add Trip</Link>

                  <div style={{ marginTop: "20px" }}>
                    <Link to="/company/add-package">Add Package</Link>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <Link to="/company/packages">My Packages</Link>
                  </div>
                </div>
              }
            />

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
