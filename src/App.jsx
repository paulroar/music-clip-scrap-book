import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePageKeys from "./pages/ProfilePageKeys";
import Profile from "./components/Profile";
import axios from "axios";
import AboutPage from "./pages/AboutPage";
// import ContactPage from './pages/ContactPage';
import "./App.css";
import "./styles/global.css";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <NavBar props={user} />
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/profile" element={<ProfilePage userId={user} />} />
        <Route
          path="/profile-keys/:songId"
          element={<ProfilePageKeys user={user} />}
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
