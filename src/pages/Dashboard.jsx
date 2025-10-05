import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings for the logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user?._id) {
          const { data } = await api.get(`/bookings/user/${user._id}`);
        setBookings(data); 
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?._id]);

  // Check if user can join session (10-minute window)
  const canJoinSession = (bookingDate, bookingTime) => {
    const now = new Date();
    const sessionDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const diff = sessionDateTime - now;
    return Math.abs(diff) <= 10 * 60 * 1000; // 10 minutes window
  };

  const handleJoin = (booking) => {
    navigate(`/videocall/${booking._id}`, {
      state: { booking, user, counselor: booking.counselor },
    });
  };

  if (loading) return <p className="p-6">Loading your bookings...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Your Dashboard</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const isJoinAvailable = canJoinSession(b.date, b.time);
            return (
              <div
                key={b._id}
                className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Counselor: {b.counselor?.name || "Unknown"}
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Date:</strong> {b.date}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Time:</strong> {b.time}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      b.paymentDone ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {b.paymentDone ? "Paid" : "Pending Payment"}
                  </span>
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => handleJoin(b)}
                    disabled={!isJoinAvailable}
                    className={`w-full py-2 rounded-lg text-white ${
                      isJoinAvailable
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isJoinAvailable ? "Join Session" : "Not Available Yet"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
