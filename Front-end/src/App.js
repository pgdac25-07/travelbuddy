// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavbarComponent from './components/NavbarComponent';
import Home from './components/HomePage';
import Login from './components/LoginComponent';
import Register from './components/RegisterComponent';
import FooterComponent from './components/FooterComponent'; // ← add this if you have a footer

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar always at top */}
        <NavbarComponent />

        {/* Main content grows to fill space */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />

            <Route
     path="/customer"
     element={<h1 style={{ textAlign: "center" }}>Customer Dashboard</h1>}
      />

      <Route
       path="/company"
      element={<h1 style={{ textAlign: "center" }}>Travel Company Dashboard</h1>}
      />


            {/* 404 page */}
            <Route
              path="*"
              element={
                <div
                  className="container py-5 text-center"
                  style={{ fontSize: '1.3rem' }}
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
          </Routes>
        </main>

        {/* Footer always at bottom */}
        {FooterComponent && <FooterComponent />}
      </div>
    </BrowserRouter>
  );
}

export default App;