import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "../utils/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [total, setTotal] = useState(0);
  const { setUser } = useContext(AuthContext);

  //  Fetch devices
  const fetchDevices = async () => {
    try {
      const res = await axios.get("/user/my-devices", {
        withCredentials: true,
      });

      setDevices(res.data.allDevices);
      setTotal(res.data.totalActiveDevices);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Logout specific device
  const handleLogoutDevice = async (sessionId, isCurrent) => {
    try {
      await axios.post(
        `/auth/logout-specific-device/${sessionId}`,
        {},
        {
          withCredentials: true,
        },
      );
      fetchDevices();
      if (isCurrent) {
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Logout other devices
  const handleLogoutOthers = async () => {
    try {
      await axios.post(
        "/auth/logout-all-except-current",
        {},
        {
          withCredentials: true,
        },
      );
      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Format time
  const formatTime = (time) => {
    return new Date(time).toLocaleString();
  };

  useEffect(() => {
    fetchDevices();
  }, []);
  console.log("devices", devices);

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Your Devices</h2>

        <p className="text-gray-500 mb-4">Total Active Devices: {total}</p>

        {/* Logout Others */}
        {devices.length > 1 && (
          <button
            onClick={handleLogoutOthers}
            className="mb-6 bg-red-500 text-white px-4 py-2 cursor-pointer rounded-lg"
          >
            Logout Other Devices
          </button>
        )}

        {/* Device List */}
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device._id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="text-2xl">
                  {device.device?.includes("Mobile") ? "📱" : "💻"}
                </div>

                {/* Info */}
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {device.device || "Unknown Device"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Last active: {formatTime(device.lastActiveAt)}
                  </p>
                </div>
              </div>

              {/* Logout button */}

              <button
                onClick={() => handleLogoutDevice(device._id, device.isCurrent)}
                className="bg-black text-white px-3 py-1 rounded-lg cursor-pointer"
              >
                Logout
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Devices;
