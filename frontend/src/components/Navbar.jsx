import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
 const { setUser } = useContext(AuthContext);

  // 🔹 Logout current device
  const handleLogout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    setUser(null)
    navigate("/login");
  };


  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-md">
      
      {/* Logo */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        MyApp
      </h1>

      {/* Buttons */}
      <div className="flex gap-4">
        
        

        <button
          onClick={()=>navigate("/about")}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg"
        >
          About
        </button>

       <button
          onClick={()=>navigate("/devices")}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg"
        >
          Devices
        </button>

        <button
          onClick={handleLogout}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;