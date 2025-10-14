import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/bookings/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(data); // includes populated counselor
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?._id]);

  const handleVideoCall = (booking) => {
    if (!booking.counselor?._id) return alert("Counselor info not available.");
    navigate(`/videocall/${booking._id}`, {
      state: { booking, user, counselor: booking.counselor },
    });
  };

  const handleChat = (booking) => {
    if (!booking.counselor?._id) return alert("Counselor info not available.");
    navigate("/chatbox", {
      state: {
        sender: user,
        receiver: booking.counselor,
        bookingId: booking._id,
      },
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">My Sessions</h1>

      {loading ? (
        <Loader />
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">You have no booked sessions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white p-5 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-700">
                Counselor: {b.counselor?.name || "N/A"}
              </h2>
              <p className="text-gray-500">
                Email: {b.counselor?.email || "N/A"}
              </p>
              <p className="text-gray-500">
                Specialty: {b.counselor?.specialty || "N/A"}
              </p>
              <p className="text-gray-500">
                Date: {b.date} ⏰ Time: {b.time}
              </p>

              {/* Communication Buttons */}
              <div className="flex gap-2 mt-3">
                {/* Video Call */}
                <button
                  onClick={() => handleVideoCall(b)}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                  📹 Video Call
                </button>

                {/* Chat */}
                {b.counselor && (
                  <button
                    onClick={() =>
                      navigate("/chatbox", {
                        state: {
                          sender: user, // Current logged-in user
                          receiver: b.counselor, // Populated counselor object
                          bookingId: b._id, // Booking reference
                        },
                      })
                    }
                    className="bg-green-600 text-white py-2 px-3.5 rounded hover:bg-green-700"
                  >
                    💬 Chat with {b.counselor.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
