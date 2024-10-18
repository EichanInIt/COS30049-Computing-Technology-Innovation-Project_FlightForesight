import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CustomNavbar from './components/Navbar';
import About from './components/About';
import Footer from './components/Footer';
import Home from './components/home';  // Import Home.jsx

function App() {
  return (
    <Router>
      <div className="app-container">
        <CustomNavbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home route */}
            <Route path="/about" element={<About />} />
            {/* Add other routes here if needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
