import axios from "../src/utils/axios";
import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/details");
      setUser(res.data.user);
    } catch (error) {
      console.log("error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    fetchUser()
  
  },[])

  return (
    <AuthContext.Provider value={{ user, setUser ,isLoading,setIsLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
