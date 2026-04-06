import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  // console.log("home isLoading ", isLoading)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center px-10">
        {/* Left */}
        <div className="w-1/2 space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Build Something Amazing 🚀
          </h2>

          <p className="text-gray-600 text-lg">
            Create, manage, and grow your ideas with our powerful platform.
          </p>
        </div>

        {/* Right */}
        <div className="w-1/2   flex justify-center">
          <img
            src="https://i.pinimg.com/1200x/4e/0a/8e/4e0a8e1887986df90af353815e316fb6.jpg"
            alt="hero"
            className="w-[80%] rounded-3xl shadow-xl"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500">
        © 2026 MyApp. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
