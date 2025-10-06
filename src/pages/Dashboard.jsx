import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMessage, setPaymentMessage] = useState("");

  // 1️⃣ Handle payment success query param
 useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  if (searchParams.get("payment") === "success") {
    setPaymentMessage("Payment successful! Your session is confirmed.");
    window.history.replaceState({}, document.title, "/dashboard");
  }
}, [location.search]);

  // 2️⃣ Fetch bookings whenever user changes or on mount
  useEffect(() => {
    if (!user?._id) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/bookings/user/${user._id}`);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?._id]);

  // 3️⃣ Determine if user can join session
  const canJoinSession = (bookingDate, bookingTime, paymentDone) => {
    const now = new Date();
    const sessionDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const diff = sessionDateTime - now;
    return paymentDone && Math.abs(diff) <= 10 * 60 * 1000; // ±10 min window
  };

  // 4️⃣ Navigate to video call
  const handleJoin = (booking) => {
    navigate(`/videocall/${booking._id}`, {
      state: { booking, user, counselor: booking.counselor },
    });
  };

  if (loading) return <p className="p-6">Loading your bookings...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Your Dashboard</h1>

      {paymentMessage && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {paymentMessage}
        </div>
      )}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const isJoinAvailable = canJoinSession(b.date, b.time, b.paymentDone);
            return (
              <div
                key={b._id}
                className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Counselor: {b.counselor?.name || "Not assigned"}
                </h3>
                <p className="text-gray-600 mb-1">
                  Email: {b.counselor?.email || "-"}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(b.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Time:</strong>{" "}
                  {new Date(`1970-01-01T${b.time}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleJoin(b)}
                    disabled={!isJoinAvailable}
                    className={`w-full py-2 rounded-lg text-white ${
                      isJoinAvailable
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isJoinAvailable
                      ? "Join Session"
                      : !b.paymentDone
                      ? "Payment Pending"
                      : "Not Available Yet"}
                  </button>

                  {b.paymentDone && (
                    <button
                      onClick={() =>
                        navigate(`/chat/${b.counselor?._id}`, {
                          state: { booking: b, user, counselor: b.counselor },
                        })
                      }
                      className="w-full py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
                    >
                      Chat with Counselor
                    </button>
                  )}
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
