// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import CustomNavbar from './components/Navbar';
import About from './components/About';
import Footer from './components/Footer';
import InputForm from './components/InputForm'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <CustomNavbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<InputForm />} /> {/* Home route */}
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
