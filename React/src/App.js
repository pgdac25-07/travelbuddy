import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';  
import Login from './components/LoginComponent';
import Register from './components/RegisterComponent';
import NavbarComponent from './components/NavbarComponent';
function App() {
  return (
     <BrowserRouter>
      <NavbarComponent />   

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
