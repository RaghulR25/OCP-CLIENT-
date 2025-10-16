import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Videocall = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const { sender, receiver, booking: bookingFromState } = location.state || {};
  const { user } = useAuth();

  const [booking, setBooking] = useState(bookingFromState || null);
  const containerRef = useRef(null);

  // ✅ Fetch booking if not in state (direct link)
  useEffect(() => {
    const fetchBooking = async () => {
      if (booking) return; // already in state
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
      }
    };
    fetchBooking();
  }, [bookingId, booking]);

  // ✅ Initialize Zego Call
  useEffect(() => {
    const initMeeting = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("Missing Zego credentials");
        return;
      }

      if (!bookingId) {
        console.error("Booking ID is missing");
        return;
      }

      const userID = user?._id || "user_" + Math.random().toString(36).slice(2, 8);
      const userName = user?.name || "Guest_" + Math.floor(Math.random() * 1000);

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        bookingId, // roomID = bookingId
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          { name: "Join Call", url: `${window.location.origin}/videocall/${bookingId}` },
        ],
        scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
        showScreenSharingButton: true,
      });
    };

    if (bookingId) initMeeting();
  }, [bookingId, user]);

  return (
    <div className="w-full h-screen bg-gray-500 flex flex-col">
      <div className="p-4 text-lg font-semibold text-white">
        📅 {booking?.date || "N/A"} ⏰ {booking?.time || "N/A"} <br />
        👤 Client: {booking?.user?.name || "N/A"} <br />
        🎓 Counselor: {booking?.counselor?.name || "N/A"}
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-[500px] w-full"
        style={{ backgroundColor: "#000" }}
      />
    </div>
  );
};

export default Videocall;
