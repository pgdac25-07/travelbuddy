// App.js (updated)
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import Login from './components/LoginComponent';
import Register from './components/RegisterComponent';
import NavbarComponent from './components/NavbarComponent';
import Home from './components/HomePage';

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />           
        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;