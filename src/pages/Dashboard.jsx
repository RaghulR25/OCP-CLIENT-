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
    const query = new URLSearchParams(window.location.search);
    const paymentStatus = query.get("payment");
    const userId = query.get("user");
    const counselorId = query.get("counselor");
    const date = query.get("date");
    const time = query.get("time");

    const createBookingAfterPayment = async () => {
      if (paymentStatus === "success" && userId && counselorId) {
        try {
          const token = localStorage.getItem("token");

          await api.post(
            "/bookings",
            { user: userId, counselor: counselorId, date, time },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("✅ Booking created successfully after payment!");
          alert("Payment successful! Your booking has been confirmed.");

         
          window.history.replaceState({}, document.title, "/dashboard");
        } catch (err) {
          console.error("❌ Failed to create booking:", err);
          alert("Booking creation failed. Please contact support.");
        }
      } else if (paymentStatus === "failed") {
        alert("Payment failed or canceled. Please try again.");
        window.history.replaceState({}, document.title, "/dashboard");
      }
    };

   
    const fetchBookings = async () => {
      if (!user?._id) return;
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/bookings/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(data);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    // Run both sequentially
    createBookingAfterPayment().then(fetchBookings);
  }, [user?._id]);

  const handleVideoCall = (booking) => {
  if (!booking?.user?._id || !booking?.counselor?._id) {
    return alert("Booking or user information missing!");
  }

  // ✅ Detect whether current user is client or counselor
  const isCounselor = user?._id === booking.counselor._id;

  // ✅ Define sender/receiver roles based on who is logged in
  const sender = isCounselor ? booking.counselor : booking.user;
  const receiver = isCounselor ? booking.user : booking.counselor;

  navigate(`/videocall/${booking._id}`, {
    state: {
      booking,     // pass full booking info
      sender,      // logged-in person
      receiver,    // opposite side
    },
  });
};


  const handleChat = (booking) => {
    if (!booking.counselor?._id) return alert("Counselor info not available.");
    navigate("/chatbox", {
      state: {
        sender: user,
        receiver: booking.counselor,
        booking, 
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

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleVideoCall(b)}
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                  📹 Video Call
                </button>

                <button
                  onClick={() => handleChat(b)}
                  className="bg-green-600 text-white py-2 px-3.5 rounded hover:bg-green-700"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => {
                    if (!b.counselor?.email) {
                      alert("Counselor email not available.");
                      return;
                    }
                    window.open(
                      `https://mail.google.com/mail/?view=cm&fs=1&to=${b.counselor.email}`,
                      "_blank"
                    );
                  }}
                  className="bg-blue-600 text-white py-2 px-3.5 rounded hover:bg-blue-700"
                >
                  📧 Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
