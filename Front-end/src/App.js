// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavbarComponent from './components/NavbarComponent';
import Home from './components/HomePage';
import Login from './components/LoginComponent';
import Register from './components/RegisterComponent';

function App() {
  return (
    <BrowserRouter>
      

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />

        {/* Optional: fallback for unknown URLs */}
        <Route path="*" element={
          <div style={{ 
            padding: '80px 20px', 
            textAlign: 'center', 
            fontSize: '1.3rem' 
          }}>
            <h2>Page not found (404)</h2>
            <p>→ <a href="/">Go back to home</a></p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;