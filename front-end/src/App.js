import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import JobBoard from './components/JobBoard/JobBoard';
import CoverLetterGenerator from './components/CoverLetterGenerator/CoverLetterGenerator';
import Companies from './components/Companies/Companies';

import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job-board" element={<JobBoard />} />
          <Route path="/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/login" element={<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
  <Login />
</GoogleOAuthProvider> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
