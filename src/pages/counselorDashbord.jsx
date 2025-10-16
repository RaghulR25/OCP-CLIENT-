import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CounselorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);

const handleVideoCall = (booking) => {
  if (!booking?._id) {
    return alert("Booking ID missing!");
  }

  // 🧩 Ensure user and counselor data exist
  const counselorData = booking?.counselor?._id
    ? booking.counselor
    : user?.role === "counselor"
    ? user
    : null;

  const userData = booking?.user?._id
    ? booking.user
    : user?.role === "user"
    ? user
    : null;

  if (!userData || !counselorData) {
    return alert("User or Counselor information missing!");
  }

  // 🧠 Identify sender/receiver
  const isCounselor = user?._id === counselorData._id;
  const sender = isCounselor ? counselorData : userData;
  const receiver = isCounselor ? userData : counselorData;

  // 🚀 Navigate to videocall page
  navigate(`/videocall/${booking._id}`, {
    state: {
      booking: { ...booking, counselor: counselorData, user: userData },
      sender,
      receiver,
    },
  });
};

const handleEmail = (booking) => {
  const clientEmail = booking?.user?.email;
  if (!clientEmail) {
    return alert("Client email not available!");
  }

  // Open Gmail compose with recipient pre-filled
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}`;
  window.open(gmailURL, "_blank");
};



  useEffect(() => {
    // if (loading) return; // wait until AuthContext finishes loading
    //if (!user?._id) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const counselor = await api.get("/counselors/get/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Counselor info:", counselor);
        const { data } = await api.get(
          `/bookings/counselor/${counselor.data._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Bookings API response:", data);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchBookings();
  }, [loading, user]);

  if (loading || fetching) return <p>Loading bookings...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Welcome, {user?.name} 👋
      </h1>

      {bookings.length === 0 ? (
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
                      onClick={() =>
                        navigate("/chatbox", {
                          state: { sender: user, receiver: b.user, booking: b },
                        })
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleVideoCall(b)}
                      className="px-3 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                    >
                      Video Call
                    </button>
                    <button
                      onClick={() => handleEmail(b)}
                      className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                    >
                      Email
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
