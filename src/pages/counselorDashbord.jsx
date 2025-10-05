import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CounselorDashboard = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get(`/bookings/counselor/${user._id}`);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchBookings();
  }, [user?._id]);

  const handleChat = (booking) => {
    navigate("/chatbox", {
      state: {
        sender: user,         
        receiver: booking.user, 
        booking,
      },
    });
  };

  const handleVideoCall = (booking) => {
    navigate(`/videocall/${booking._id}`, {
      state: {
        sender: user,          
        receiver: booking.user, 
        booking,
      },
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Welcome, {user?.name} 👋
      </h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-3 border">Client</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{b.user?.name}</td>
                  <td className="p-3 border">{b.user?.email}</td>
                  <td className="p-3 border">{b.date}</td>
                  <td className="p-3 border">{b.time}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleChat(b)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleVideoCall(b)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Video Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;
