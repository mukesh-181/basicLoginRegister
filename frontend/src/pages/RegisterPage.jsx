import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setUser} = useContext(AuthContext)
  const navigate = useNavigate();

  const formHandler = async (e) => {
    e.preventDefault();
    console.log("username:", username, "email:", email, "password:", password);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          userName:username,
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      setUser(res.data.user)
      toast.success('Register Successful !', {
  duration: 3000, // 3 second
});
    //   console.log("res register", res);
    //   console.log("res register", res.data);
      navigate("/");
    } catch (error) {
      console.log("error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {/* Left Side */}
      <div className="h-[90%] w-[40%] bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold mb-2">Welcome Back 👏</h2>
        <p className="text-sm text-gray-500 mb-6">
          Every time you log in, you’re one step closer to your goals.
        </p>

        <form onSubmit={formHandler} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="raj123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="raj@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-gray-700 hover:bg-gray-800 cursor-pointer text-white py-2 rounded-xl transition"
          >
            Sign Up
          </button>
        </form>

        {/* Register */}
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3 p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition">
            <FcGoogle /> <span>Sign in with Google</span>
          </div>

          <div className="flex items-center justify-center gap-3 p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition">
            <FaFacebook className="text-blue-600" />
            <span>Sign in with Facebook</span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 h-[90%] m-10">
        <img
          src="https://i.pinimg.com/1200x/4e/0a/8e/4e0a8e1887986df90af353815e316fb6.jpg"
          alt="login visual"
          className="w-[80%] h-full object-cover m-auto rounded-3xl shadow-xl"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
