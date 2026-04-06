import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import { AuthContext } from "../context/AuthContext";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";
import About from "./pages/About";
import Devices from "./pages/Devices";
import './utils/axios'

const App = () => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={user ? <Home /> : <LoginPage />} />
        <Route path="/login" element={user ? <Home /> : <LoginPage />} />
        <Route path="/register" element={user ? <Home /> : <RegisterPage />} />
        <Route path="/about" element={user ? <About /> : <LoginPage />} />
        <Route path="/devices" element={user ? <Devices /> : <LoginPage />} />
      </Routes>
    </>
  );
};

export default App;
