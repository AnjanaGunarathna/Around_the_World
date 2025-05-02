import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CountryDetails from './components/CountryDetails';
import Onboard from './components/Onboard';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";




export default function App()
{
  return (
    <Router>
      <Routes>
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/country/:code" element={<CountryDetails />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
