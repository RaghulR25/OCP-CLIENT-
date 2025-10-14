import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const CounselorDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return; // wait until AuthContext finishes loading
    if (!user?._id) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/bookings/counselor/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
         console.log("Bookings API response:", data)
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
                      onClick={() => navigate("/chatbox", {
                        state: { sender: user, receiver: b.user, booking: b }
                      })}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => {
                        const now = new Date();
                        const bookingTime = new Date(`${b.date}T${b.time}`);
                        if (now < bookingTime) {
                          return alert(
                            "You can join the video call only at or after the scheduled time."
                          );
                        }
                        navigate(`/videocall/${b._id}`, {
                          state: { sender: user, receiver: b.user, booking: b }
                        });
                      }}
                      className={`px-3 py-1 rounded text-white ${
                        new Date() >= new Date(`${b.date}T${b.time}`)
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={new Date() < new Date(`${b.date}T${b.time}`)}
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
